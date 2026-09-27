-- ==============================================================================
-- 專案排程系統 (ProjectScheduler) Supabase PostgreSQL 完整執行腳本 (無 version 版本)
-- 1. 表不存在時自動建立；已存在時自動略過
-- 2. 完全對齊現有 tasks 欄位：無 version，支援 assignees 陣列
-- 3. 完美相容目前資料：task_1, task_2, proj_1, mem_1 (Alex Chen), mem_2 (Sarah Wu)
-- 4. 包含衝突測試資料 (Alex Chen 於 8/26~8/27 撞期) 與 2026 國定假日
-- ==============================================================================

-- STEP 1. 檢查並建立 TaskStatus 列舉型別 (若不存在)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TaskStatus') THEN
        CREATE TYPE "TaskStatus" AS ENUM ('todo', 'in_progress', 'done');
        RAISE NOTICE '已建立 TaskStatus ENUM';
    END IF;
END $$;

-- STEP 2. 條件檢查與自動建表 (若表不存在才建立，無 version 欄位)
DO $$ 
BEGIN
    -- 2.1 專案主表 (projects)
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
        CREATE TABLE public.projects (
            id VARCHAR(36) NOT NULL,
            name VARCHAR(100) NOT NULL,
            description TEXT DEFAULT '',
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            progress SMALLINT NOT NULL DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT pk_projects PRIMARY KEY (id),
            CONSTRAINT chk_projects_dates CHECK (start_date <= end_date)
        );
        RAISE NOTICE '【自動建立】projects 資料表';
    END IF;

    -- 2.2 專案里程碑表 (project_milestones)
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_milestones') THEN
        CREATE TABLE public.project_milestones (
            id VARCHAR(36) NOT NULL,
            project_id VARCHAR(36) NOT NULL,
            title VARCHAR(100) NOT NULL,
            order_index INT NOT NULL DEFAULT 0,
            CONSTRAINT pk_project_milestones PRIMARY KEY (id),
            CONSTRAINT fk_milestones_project FOREIGN KEY (project_id) REFERENCES public.projects (id) ON DELETE CASCADE
        );
        RAISE NOTICE '【自動建立】project_milestones 資料表';
    END IF;

    -- 2.3 團隊成員表 (members)
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'members') THEN
        CREATE TABLE public.members (
            id VARCHAR(36) NOT NULL,
            name VARCHAR(100) NOT NULL,
            role VARCHAR(50) NOT NULL,
            avatar VARCHAR(255) DEFAULT NULL,
            user_id VARCHAR(36) DEFAULT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT pk_members PRIMARY KEY (id)
        );
        RAISE NOTICE '【自動建立】members 資料表';
    END IF;

    -- 2.4 排程任務表 (tasks) - 無 version 欄位
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tasks') THEN
        CREATE TABLE public.tasks (
            id VARCHAR(36) NOT NULL,
            project_id VARCHAR(36) NOT NULL,
            name VARCHAR(150) NOT NULL,
            assignees TEXT[] DEFAULT '{}',
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'todo',
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT pk_tasks PRIMARY KEY (id),
            CONSTRAINT chk_tasks_dates CHECK (start_date <= end_date)
        );
        RAISE NOTICE '【自動建立】tasks 資料表';
    END IF;

    -- 2.5 任務指派中介表 (task_assignees)
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'task_assignees') THEN
        CREATE TABLE public.task_assignees (
            task_id VARCHAR(36) NOT NULL,
            member_id VARCHAR(36) NOT NULL,
            assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT pk_task_assignees PRIMARY KEY (task_id, member_id),
            CONSTRAINT fk_assignees_task FOREIGN KEY (task_id) REFERENCES public.tasks (id) ON DELETE CASCADE,
            CONSTRAINT fk_assignees_member FOREIGN KEY (member_id) REFERENCES public.members (id) ON DELETE CASCADE
        );
        RAISE NOTICE '【自動建立】task_assignees 資料表';
    END IF;

    -- 2.6 國定假日表 (holidays)
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'holidays') THEN
        CREATE TABLE public.holidays (
            date VARCHAR(8) NOT NULL,
            week VARCHAR(4) NOT NULL,
            is_holiday BOOLEAN NOT NULL DEFAULT TRUE,
            description VARCHAR(100) DEFAULT NULL,
            CONSTRAINT pk_holidays PRIMARY KEY (date)
        );
        RAISE NOTICE '【自動建立】holidays 資料表';
    END IF;
END $$;

-- STEP 3. 確保既有欄位相容性 (不增加 version)
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS assignees TEXT[] DEFAULT '{}';
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'todo';
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS project_id VARCHAR(36);
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS progress SMALLINT DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

-- 若既有 tasks 表的 idx 欄位有 NOT NULL 約束，放寬以便安全插入新任務
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'tasks' AND column_name = 'idx' AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.tasks ALTER COLUMN idx DROP NOT NULL;
    END IF;
END $$;

-- STEP 4. 建立高效能 B-Tree 複合索引 (若已存在則自動略過)
CREATE INDEX IF NOT EXISTS idx_projects_dates ON public.projects (start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_tasks_schedule_dates ON public.tasks (start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks (project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks (status);
CREATE INDEX IF NOT EXISTS idx_task_assignees_member_id ON public.task_assignees (member_id);

-- ==============================================================================
-- STEP 5. 同步假資料 (完全不包含 version 欄位)
-- ==============================================================================

-- 5.1 確保專案主檔 (proj_1 供 task_1 與 task_2 關聯)
INSERT INTO public.projects (id, name, description, start_date, end_date, progress, created_at, updated_at) VALUES
('proj_1', 'UberMenu 系統排程重構專案', '微服務架構拆分、甘特圖排程與即時狀態同步', '2026-08-01', '2026-09-30', 50, '2026-08-01 08:00:00+00', '2026-08-20 10:30:00+00'),
('proj_2', '行動 App 多語系開發', '跨平台 Ionic Vue 與 i18n 擴充', '2026-08-10', '2026-09-15', 25, '2026-08-10 09:00:00+00', '2026-08-18 14:00:00+00')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    progress = EXCLUDED.progress;

-- 5.2 插入專案里程碑
INSERT INTO public.project_milestones (id, project_id, title, order_index) VALUES
('pm_1', 'proj_1', '需求訪談與規格確認', 0),
('pm_2', 'proj_1', 'UI 與甘特圖設計', 1),
('pm_3', 'proj_1', '後端 API 實作', 2),
('pm_4', 'proj_2', '多語系表單規格', 0)
ON CONFLICT (id) DO NOTHING;

-- 5.3 同步既有成員資料 (mem_1: Alex Chen, mem_2: Sarah Wu)
INSERT INTO public.members (id, name, role, avatar, created_at, updated_at) VALUES
('mem_1', 'Alex Chen', '後端工程師', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', '2026-08-26 06:56:17.336188+00', '2026-08-26 06:56:17.336188+00'),
('mem_2', 'Sarah Wu', '前端工程師', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', '2026-08-26 06:56:17.336188+00', '2026-08-26 06:56:17.336188+00')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name,
    role = EXCLUDED.role,
    avatar = EXCLUDED.avatar,
    updated_at = EXCLUDED.updated_at;

-- 5.4 同步既有任務 (task_1, task_2) 並擴充衝突測試任務 (task_3, task_4, task_5) - 完全不含 version
INSERT INTO public.tasks (id, project_id, name, assignees, start_date, end_date, status, created_at, updated_at) VALUES
('task_1', 'proj_1', '實作統一 Response 攔截器', ARRAY['mem_1'], '2026-08-20', '2026-08-25', 'done', '2026-08-26 06:56:17.336188+00', '2026-08-26 06:56:17.336188+00'),
('task_2', 'proj_1', '產出 Supabase 完整運行 SQL 腳本', ARRAY['mem_1'], '2026-08-26', '2026-08-27', 'in_progress', '2026-08-26 06:56:17.336188+00', '2026-08-26 06:56:17.336188+00'),
-- ⭐ 撞期衝突 1：Alex Chen (mem_1) 在 8/26~8/27 同時被指派 task_2 與 task_3 (皆為進行中)
('task_3', 'proj_1', 'API 整合測試與效能調校', ARRAY['mem_1'], '2026-08-26', '2026-08-30', 'in_progress', '2026-08-26 08:00:00+00', '2026-08-26 08:00:00+00'),
-- ⭐ 撞期衝突 2：Sarah Wu (mem_2) 在 8/25~8/28 同時被指派 task_4 與 task_5
('task_4', 'proj_1', '甘特圖時間軸介面優化', ARRAY['mem_2'], '2026-08-22', '2026-08-28', 'todo', '2026-08-26 08:00:00+00', '2026-08-26 08:00:00+00'),
('task_5', 'proj_2', '月曆國定假日標註功能', ARRAY['mem_2'], '2026-08-25', '2026-08-31', 'todo', '2026-08-26 08:00:00+00', '2026-08-26 08:00:00+00')
ON CONFLICT (id) DO UPDATE 
SET project_id = EXCLUDED.project_id,
    name = EXCLUDED.name,
    assignees = EXCLUDED.assignees,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;

-- 5.5 同步任務指派中介表記錄 (供關聯式 JOIN 查詢與衝突檢測演算法使用)
INSERT INTO public.task_assignees (task_id, member_id, assigned_at) VALUES
('task_1', 'mem_1', '2026-08-20 08:00:00+00'),
('task_2', 'mem_1', '2026-08-26 08:00:00+00'),
('task_3', 'mem_1', '2026-08-26 09:00:00+00'), -- Alex Chen 撞期 (task_2 & task_3)
('task_4', 'mem_2', '2026-08-22 08:00:00+00'),
('task_5', 'mem_2', '2026-08-25 08:00:00+00')  -- Sarah Wu 撞期 (task_4 & task_5)
ON CONFLICT (task_id, member_id) DO NOTHING;

-- 5.6 插入台灣 2026 國定假日假資料
INSERT INTO public.holidays (date, week, is_holiday, description) VALUES
('20260101', '四', TRUE, '中華民國開國紀念日 (元旦)'),
('20260215', '日', TRUE, '農曆除夕前一日 (小年夜)'),
('20260216', '一', TRUE, '農曆除夕'),
('20260217', '二', TRUE, '春節初一'),
('20260218', '三', TRUE, '春節初二'),
('20260219', '四', TRUE, '春節初三'),
('20260228', '六', TRUE, '和平紀念日'),
('20260403', '五', TRUE, '兒童節'),
('20260404', '六', TRUE, '民族掃墓節 (清明節)'),
('20260501', '五', TRUE, '勞動節'),
('20260619', '五', TRUE, '端午節'),
('20260925', '五', TRUE, '中秋節'),
('20261010', '六', TRUE, '國慶日')
ON CONFLICT (date) DO UPDATE 
SET week = EXCLUDED.week, 
    is_holiday = EXCLUDED.is_holiday, 
    description = EXCLUDED.description;
