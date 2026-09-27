-- ==============================================================================
-- 菜單營業時段與供應時間 (MenuTime / Store Hours) Supabase PostgreSQL 完整執行腳本
-- 依據 api-menu-time.md 規範設計：
-- 1. 具備全冪等性 (Idempotent)：表、索引、欄位與資料若已存在皆安全相容，可反覆執行。
-- 2. 同步支援 Prisma JSON 結構與正規化關聯表 (雙模無縫支援)。
-- 3. 完整建立：menus, categories, items, modifier_groups, menu_service_availabilities,
--              menu_time_periods, menu_categories。
-- 4. 內建自動種子資料：store_hours (常規門市時段)、menu_breakfast (早餐特化時段)、
--                      分類與商品品項實質勾稽資料。
-- 5. 內建 PostgreSQL 即時營業狀態運算函數 (fn_check_menu_status / fn_check_item_availability)。
-- 6. 包含執行驗證 SELECT 查詢，執行完畢立即可於 Supabase 結果視窗預覽。
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- STEP 1. 擴充功能檢查 (UUID 生成器)
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- STEP 2. 條件檢查與自動建表 (若表不存在則自動建立)
-- ------------------------------------------------------------------------------
DO $$ 
BEGIN
    -- 2.1 菜單主表 (menus)
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'menus') THEN
        CREATE TABLE public.menus (
            id VARCHAR(64) NOT NULL,
            title JSONB NOT NULL DEFAULT '{"translations": {"zh": "營業時間", "en": "Store Hours"}}'::jsonb,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            service_availability JSONB DEFAULT '[]'::jsonb,
            category_ids TEXT[] DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT pk_menus PRIMARY KEY (id)
        );
        RAISE NOTICE '【自動建立】menus 資料表';
    END IF;

    -- 2.2 菜單分類表 (categories) - 若現有系統未建立
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'categories') THEN
        CREATE TABLE public.categories (
            id VARCHAR(64) NOT NULL,
            title JSONB NOT NULL DEFAULT '{"translations": {"zh": "未命名分類", "en": "Untitled"}}'::jsonb,
            entities JSONB DEFAULT '[]'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT pk_categories PRIMARY KEY (id)
        );
        RAISE NOTICE '【自動建立】categories 資料表';
    END IF;

    -- 2.3 菜單商品品項表 (items) - 若現有系統未建立
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'items') THEN
        CREATE TABLE public.items (
            id VARCHAR(64) NOT NULL,
            external_data VARCHAR(255) DEFAULT NULL,
            title JSONB NOT NULL DEFAULT '{"translations": {"zh": "未命名商品", "en": "Untitled Item"}}'::jsonb,
            description JSONB DEFAULT '{"translations": {"zh": "", "en": ""}}'::jsonb,
            image_url VARCHAR(255) NOT NULL DEFAULT '',
            price_info JSONB NOT NULL DEFAULT '{"price": 0, "core_price": 0, "formatted_price": "$0"}'::jsonb,
            quantity_info JSONB DEFAULT NULL,
            modifier_group_ids JSONB DEFAULT '[]'::jsonb,
            tax_info JSONB DEFAULT NULL,
            nutritional_info JSONB DEFAULT NULL,
            dish_info JSONB DEFAULT NULL,
            tax_label_info JSONB DEFAULT NULL,
            product_info JSONB DEFAULT NULL,
            bundled_items JSONB DEFAULT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT pk_items PRIMARY KEY (id)
        );
        RAISE NOTICE '【自動建立】items 資料表';
    END IF;

    -- 2.4 客製化配料群組表 (modifier_groups) - 若現有系統未建立
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'modifier_groups') THEN
        CREATE TABLE public.modifier_groups (
            id VARCHAR(64) NOT NULL,
            title JSONB DEFAULT '{"translations": {"zh": "加料群組", "en": "Modifiers"}}'::jsonb,
            quantity_info JSONB DEFAULT NULL,
            modifier_options JSONB DEFAULT '[]'::jsonb,
            extra_data JSONB DEFAULT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT pk_modifier_groups PRIMARY KEY (id)
        );
        RAISE NOTICE '【自動建立】modifier_groups 資料表';
    END IF;

    -- 2.5 每週天數排程主表 (menu_service_availabilities) - 規格 3.2 & 3.3
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'menu_service_availabilities') THEN
        CREATE TABLE public.menu_service_availabilities (
            id UUID NOT NULL DEFAULT gen_random_uuid(),
            menu_id VARCHAR(64) NOT NULL,
            day_of_week VARCHAR(10) NOT NULL,
            CONSTRAINT pk_menu_service_availabilities PRIMARY KEY (id),
            CONSTRAINT fk_availabilities_menu FOREIGN KEY (menu_id) REFERENCES public.menus (id) ON DELETE CASCADE,
            CONSTRAINT chk_avail_day_of_week CHECK (day_of_week IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')),
            CONSTRAINT uq_menu_day UNIQUE (menu_id, day_of_week)
        );
        RAISE NOTICE '【自動建立】menu_service_availabilities 資料表';
    END IF;

    -- 2.6 具體營業時間區段表 (menu_time_periods) - 規格 3.2 & 3.3
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'menu_time_periods') THEN
        CREATE TABLE public.menu_time_periods (
            id UUID NOT NULL DEFAULT gen_random_uuid(),
            availability_id UUID NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            sort_order INT NOT NULL DEFAULT 0,
            CONSTRAINT pk_menu_time_periods PRIMARY KEY (id),
            CONSTRAINT fk_periods_availability FOREIGN KEY (availability_id) REFERENCES public.menu_service_availabilities (id) ON DELETE CASCADE,
            CONSTRAINT chk_time_order CHECK (start_time < end_time)
        );
        RAISE NOTICE '【自動建立】menu_time_periods 資料表';
    END IF;

    -- 2.7 菜單與分類勾稽關聯表 (menu_categories) - 規格 3.2 & 3.3
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'menu_categories') THEN
        CREATE TABLE public.menu_categories (
            menu_id VARCHAR(64) NOT NULL,
            category_id VARCHAR(64) NOT NULL,
            CONSTRAINT pk_menu_categories PRIMARY KEY (menu_id, category_id),
            CONSTRAINT fk_menu_categories_menu FOREIGN KEY (menu_id) REFERENCES public.menus (id) ON DELETE CASCADE,
            CONSTRAINT fk_menu_categories_category FOREIGN KEY (category_id) REFERENCES public.categories (id) ON DELETE CASCADE
        );
        RAISE NOTICE '【自動建立】menu_categories 資料表';
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- STEP 3. 確保欄位相容性 (若既有表缺少欄位則安全補齊)
-- ------------------------------------------------------------------------------
ALTER TABLE public.menus ADD COLUMN IF NOT EXISTS service_availability JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.menus ADD COLUMN IF NOT EXISTS category_ids TEXT[] DEFAULT '{}';
ALTER TABLE public.menus ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.menus ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS entities JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE public.items ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ACTIVE';
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- ------------------------------------------------------------------------------
-- STEP 4. 建立高效能 B-Tree 索引 (若已存在則自動略過)
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_time_periods_avail ON public.menu_time_periods (availability_id);
CREATE INDEX IF NOT EXISTS idx_time_periods_order ON public.menu_time_periods (availability_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_availabilities_menu ON public.menu_service_availabilities (menu_id);
CREATE INDEX IF NOT EXISTS idx_menu_availabilities_day ON public.menu_service_availabilities (day_of_week);
CREATE INDEX IF NOT EXISTS idx_menu_categories_cat ON public.menu_categories (category_id);
CREATE INDEX IF NOT EXISTS idx_menus_is_active ON public.menus (is_active);
CREATE INDEX IF NOT EXISTS idx_items_status_created ON public.items (status, created_at DESC);

-- ------------------------------------------------------------------------------
-- STEP 5. 建立自動更新 updated_at 之 Trigger (觸發器)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_menus_updated_at ON public.menus;
CREATE TRIGGER trg_menus_updated_at
BEFORE UPDATE ON public.menus
FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_set_updated_at();

-- ------------------------------------------------------------------------------
-- STEP 6. 同步商業勾稽種子資料 (Categories, Items, Menus)
-- ------------------------------------------------------------------------------

-- 6.1 建立商品品項 (items)
INSERT INTO public.items (id, title, description, image_url, price_info, status, created_at, updated_at)
VALUES
(
    'item_black_tea',
    '{"translations": {"zh": "阿薩姆經典紅茶", "en": "Assam Black Tea"}}'::jsonb,
    '{"translations": {"zh": "精選天然阿薩姆熟成茶葉，茶韻甘醇厚實，可調整甜度與冰塊。", "en": "Premium matured Assam tea with robust aroma."}}'::jsonb,
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
    '{"price": 60, "core_price": 60, "formatted_price": "$60"}'::jsonb,
    'ACTIVE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'item_cake',
    '{"translations": {"zh": "義式經典提拉米蘇", "en": "Classic Tiramisu"}}'::jsonb,
    '{"translations": {"zh": "特選馬斯卡彭乳酪與浸潤濃縮咖啡酒的手指餅乾，口感細緻綿密。", "en": "Authentic Italian mascarpone cheese cake with espresso note."}}'::jsonb,
    'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80',
    '{"price": 120, "core_price": 120, "formatted_price": "$120"}'::jsonb,
    'ACTIVE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'item_sandwich',
    '{"translations": {"zh": "總匯起司蛋三明治", "en": "Club Sandwich"}}'::jsonb,
    '{"translations": {"zh": "全麥吐司搭配新鮮萵苣、現煎嫩蛋、煙燻火腿與切達起司。", "en": "Fresh whole wheat club sandwich with egg, ham, and cheddar."}}'::jsonb,
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80',
    '{"price": 95, "core_price": 95, "formatted_price": "$95"}'::jsonb,
    'ACTIVE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    price_info = EXCLUDED.price_info,
    status = EXCLUDED.status,
    updated_at = CURRENT_TIMESTAMP;

-- 6.2 建立分類 (categories) 並將 items 綁定至 entities
INSERT INTO public.categories (id, title, entities, created_at, updated_at)
VALUES
(
    'cat_beverage',
    '{"translations": {"zh": "現調飲品類", "en": "Beverages"}}'::jsonb,
    '[{"id": "item_black_tea", "type": "ITEM"}]'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'cat_dessert',
    '{"translations": {"zh": "精緻甜點類", "en": "Desserts"}}'::jsonb,
    '[{"id": "item_cake", "type": "ITEM"}]'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'cat_breakfast',
    '{"translations": {"zh": "晨間活力早餐", "en": "Breakfast"}}'::jsonb,
    '[{"id": "item_sandwich", "type": "ITEM"}]'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    entities = EXCLUDED.entities,
    updated_at = CURRENT_TIMESTAMP;

-- 6.3 建立門市預設排程 (store_hours: 依據 api-menu-time.md 4.1 規格)
-- 週一：09:00~14:00, 17:00~21:30
-- 週二：09:00~21:30
-- 週三：公休 (空時段陣列)
-- 週四：09:00~21:30
-- 週五：09:00~22:00
-- 週六：10:00~22:00
-- 週日：10:00~21:00
-- category_ids: ['cat_beverage', 'cat_dessert']
INSERT INTO public.menus (id, title, is_active, category_ids, service_availability, created_at, updated_at)
VALUES
(
    'store_hours',
    '{"translations": {"zh": "門市常規營業時間", "en": "Store Hours"}}'::jsonb,
    TRUE,
    ARRAY['cat_beverage', 'cat_dessert'],
    '[
        {"day_of_week": "MONDAY", "time_periods": [{"start_time": "09:00", "end_time": "14:00"}, {"start_time": "17:00", "end_time": "21:30"}]},
        {"day_of_week": "TUESDAY", "time_periods": [{"start_time": "09:00", "end_time": "21:30"}]},
        {"day_of_week": "WEDNESDAY", "time_periods": []},
        {"day_of_week": "THURSDAY", "time_periods": [{"start_time": "09:00", "end_time": "21:30"}]},
        {"day_of_week": "FRIDAY", "time_periods": [{"start_time": "09:00", "end_time": "22:00"}]},
        {"day_of_week": "SATURDAY", "time_periods": [{"start_time": "10:00", "end_time": "22:00"}]},
        {"day_of_week": "SUNDAY", "time_periods": [{"start_time": "10:00", "end_time": "21:00"}]}
    ]'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'menu_breakfast',
    '{"translations": {"zh": "晨間早餐供應時段", "en": "Breakfast Menu Hours"}}'::jsonb,
    TRUE,
    ARRAY['cat_breakfast'],
    '[
        {"day_of_week": "MONDAY", "time_periods": [{"start_time": "06:30", "end_time": "10:30"}]},
        {"day_of_week": "TUESDAY", "time_periods": [{"start_time": "06:30", "end_time": "10:30"}]},
        {"day_of_week": "WEDNESDAY", "time_periods": [{"start_time": "06:30", "end_time": "10:30"}]},
        {"day_of_week": "THURSDAY", "time_periods": [{"start_time": "06:30", "end_time": "10:30"}]},
        {"day_of_week": "FRIDAY", "time_periods": [{"start_time": "06:30", "end_time": "10:30"}]},
        {"day_of_week": "SATURDAY", "time_periods": [{"start_time": "07:00", "end_time": "11:00"}]},
        {"day_of_week": "SUNDAY", "time_periods": [{"start_time": "07:00", "end_time": "11:00"}]}
    ]'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    is_active = EXCLUDED.is_active,
    category_ids = EXCLUDED.category_ids,
    service_availability = EXCLUDED.service_availability,
    updated_at = CURRENT_TIMESTAMP;

-- 6.4 同步正規化關聯表 (menu_categories)
INSERT INTO public.menu_categories (menu_id, category_id)
VALUES
    ('store_hours', 'cat_beverage'),
    ('store_hours', 'cat_dessert'),
    ('menu_breakfast', 'cat_breakfast')
ON CONFLICT (menu_id, category_id) DO NOTHING;

-- 6.5 同步正規化關聯表 (menu_service_availabilities 與 menu_time_periods)
DO $$
DECLARE
    m TEXT;
    v_menu_id VARCHAR(64);
    v_avail_id UUID;
BEGIN
    -- 清理既有時段並重新同步
    DELETE FROM public.menu_service_availabilities WHERE menu_id IN ('store_hours', 'menu_breakfast');

    -- -------------------------------------------------------------
    -- A. 同步 store_hours
    -- -------------------------------------------------------------
    v_menu_id := 'store_hours';

    -- 週一 (兩個時段: 09:00~14:00, 17:00~21:30)
    INSERT INTO public.menu_service_availabilities (id, menu_id, day_of_week)
    VALUES (gen_random_uuid(), v_menu_id, 'MONDAY') RETURNING id INTO v_avail_id;
    INSERT INTO public.menu_time_periods (availability_id, start_time, end_time, sort_order)
    VALUES 
        (v_avail_id, '09:00'::time, '14:00'::time, 0),
        (v_avail_id, '17:00'::time, '21:30'::time, 1);

    -- 週二 (09:00~21:30)
    INSERT INTO public.menu_service_availabilities (id, menu_id, day_of_week)
    VALUES (gen_random_uuid(), v_menu_id, 'TUESDAY') RETURNING id INTO v_avail_id;
    INSERT INTO public.menu_time_periods (availability_id, start_time, end_time, sort_order)
    VALUES (v_avail_id, '09:00'::time, '21:30'::time, 0);

    -- 週三 (公休，不建立 time_periods)
    INSERT INTO public.menu_service_availabilities (id, menu_id, day_of_week)
    VALUES (gen_random_uuid(), v_menu_id, 'WEDNESDAY');

    -- 週四 (09:00~21:30)
    INSERT INTO public.menu_service_availabilities (id, menu_id, day_of_week)
    VALUES (gen_random_uuid(), v_menu_id, 'THURSDAY') RETURNING id INTO v_avail_id;
    INSERT INTO public.menu_time_periods (availability_id, start_time, end_time, sort_order)
    VALUES (v_avail_id, '09:00'::time, '21:30'::time, 0);

    -- 週五 (09:00~22:00)
    INSERT INTO public.menu_service_availabilities (id, menu_id, day_of_week)
    VALUES (gen_random_uuid(), v_menu_id, 'FRIDAY') RETURNING id INTO v_avail_id;
    INSERT INTO public.menu_time_periods (availability_id, start_time, end_time, sort_order)
    VALUES (v_avail_id, '09:00'::time, '22:00'::time, 0);

    -- 週六 (10:00~22:00)
    INSERT INTO public.menu_service_availabilities (id, menu_id, day_of_week)
    VALUES (gen_random_uuid(), v_menu_id, 'SATURDAY') RETURNING id INTO v_avail_id;
    INSERT INTO public.menu_time_periods (availability_id, start_time, end_time, sort_order)
    VALUES (v_avail_id, '10:00'::time, '22:00'::time, 0);

    -- 週日 (10:00~21:00)
    INSERT INTO public.menu_service_availabilities (id, menu_id, day_of_week)
    VALUES (gen_random_uuid(), v_menu_id, 'SUNDAY') RETURNING id INTO v_avail_id;
    INSERT INTO public.menu_time_periods (availability_id, start_time, end_time, sort_order)
    VALUES (v_avail_id, '10:00'::time, '21:00'::time, 0);

    -- -------------------------------------------------------------
    -- B. 同步 menu_breakfast
    -- -------------------------------------------------------------
    v_menu_id := 'menu_breakfast';

    FOREACH m IN ARRAY ARRAY['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
    LOOP
        INSERT INTO public.menu_service_availabilities (id, menu_id, day_of_week)
        VALUES (gen_random_uuid(), v_menu_id, m) RETURNING id INTO v_avail_id;
        INSERT INTO public.menu_time_periods (availability_id, start_time, end_time, sort_order)
        VALUES (v_avail_id, '06:30'::time, '10:30'::time, 0);
    END LOOP;

    FOREACH m IN ARRAY ARRAY['SATURDAY', 'SUNDAY']
    LOOP
        INSERT INTO public.menu_service_availabilities (id, menu_id, day_of_week)
        VALUES (gen_random_uuid(), v_menu_id, m) RETURNING id INTO v_avail_id;
        INSERT INTO public.menu_time_periods (availability_id, start_time, end_time, sort_order)
        VALUES (v_avail_id, '07:00'::time, '11:00'::time, 0);
    END LOOP;

    RAISE NOTICE '【資料庫同步完成】menu_service_availabilities 與 menu_time_periods 已完成種子排程資料注入';
END $$;

-- ------------------------------------------------------------------------------
-- STEP 7. 建立 PostgreSQL 即時狀態判定自訂函數 (供 DB 直接計算或 RPC 呼叫)
-- ------------------------------------------------------------------------------

-- 7.1 計算菜單當下是否在營業時段內 (fn_check_menu_status)
CREATE OR REPLACE FUNCTION public.fn_check_menu_status(
    p_menu_id VARCHAR,
    p_check_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    p_timezone VARCHAR DEFAULT 'Asia/Taipei'
)
RETURNS TABLE (
    menu_id VARCHAR,
    is_open BOOLEAN,
    current_time_iso TEXT,
    current_day TEXT,
    active_start_time TEXT,
    active_end_time TEXT,
    next_event TEXT,
    next_event_time TEXT
) AS $$
DECLARE
    v_target_day TEXT;
    v_target_time TIME;
    v_is_open BOOLEAN := FALSE;
    v_active_start TEXT := NULL;
    v_active_end TEXT := NULL;
    v_next_event TEXT := NULL;
    v_next_time TEXT := NULL;
    r RECORD;
BEGIN
    -- 取得目標時區之星期大寫與當前時間
    v_target_day := TRIM(UPPER(to_char(p_check_time AT TIME ZONE p_timezone, 'Day')));
    v_target_time := (p_check_time AT TIME ZONE p_timezone)::time;

    -- 1. 檢查目前是否落在今天的某個時段內
    FOR r IN (
        SELECT tp.start_time, tp.end_time
        FROM public.menu_time_periods tp
        JOIN public.menu_service_availabilities msa ON tp.availability_id = msa.id
        WHERE msa.menu_id = p_menu_id AND msa.day_of_week = v_target_day
        ORDER BY tp.start_time ASC
    ) LOOP
        IF v_target_time >= r.start_time AND v_target_time < r.end_time THEN
            v_is_open := TRUE;
            v_active_start := to_char(r.start_time, 'HH24:MI');
            v_active_end := to_char(r.end_time, 'HH24:MI');
            v_next_event := 'CLOSE';
            v_next_time := to_char(r.end_time, 'HH24:MI');
            EXIT;
        END IF;
    END LOOP;

    -- 2. 若未營業，尋找今天後續即將開啟的時段
    IF NOT v_is_open THEN
        SELECT to_char(tp.start_time, 'HH24:MI') INTO v_next_time
        FROM public.menu_time_periods tp
        JOIN public.menu_service_availabilities msa ON tp.availability_id = msa.id
        WHERE msa.menu_id = p_menu_id AND msa.day_of_week = v_target_day AND tp.start_time > v_target_time
        ORDER BY tp.start_time ASC
        LIMIT 1;

        IF v_next_time IS NOT NULL THEN
            v_next_event := 'OPEN';
        END IF;
    END IF;

    RETURN QUERY SELECT 
        p_menu_id,
        v_is_open,
        to_char(p_check_time AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        v_target_day,
        v_active_start,
        v_active_end,
        v_next_event,
        v_next_time;
END;
$$ LANGUAGE plpgsql;

-- 7.2 計算商品品項當下是否可供點選 (fn_check_item_availability)
CREATE OR REPLACE FUNCTION public.fn_check_item_availability(
    p_item_id VARCHAR,
    p_check_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    p_timezone VARCHAR DEFAULT 'Asia/Taipei'
)
RETURNS TABLE (
    item_id VARCHAR,
    is_available BOOLEAN,
    active_menu_id VARCHAR,
    message TEXT
) AS $$
DECLARE
    v_menu_rec RECORD;
    v_status RECORD;
    v_matched_menus INT := 0;
BEGIN
    -- 尋找綁定包含此品項之分類的所有菜單
    FOR v_menu_rec IN (
        SELECT DISTINCT mc.menu_id
        FROM public.menu_categories mc
        JOIN public.categories c ON mc.category_id = c.id
        WHERE c.entities @> jsonb_build_array(jsonb_build_object('id', p_item_id))
    ) LOOP
        v_matched_menus := v_matched_menus + 1;
        SELECT * INTO v_status FROM public.fn_check_menu_status(v_menu_rec.menu_id, p_check_time, p_timezone);
        IF v_status.is_open THEN
            RETURN QUERY SELECT p_item_id, TRUE, v_menu_rec.menu_id, '商品目前處於供應時段中'::TEXT;
            RETURN;
        END IF;
    END LOOP;

    -- 若無特定特化菜單綁定，繼承 store_hours
    IF v_matched_menus = 0 THEN
        SELECT * INTO v_status FROM public.fn_check_menu_status('store_hours', p_check_time, p_timezone);
        IF v_status.is_open THEN
            RETURN QUERY SELECT p_item_id, TRUE, 'store_hours'::VARCHAR, '商品繼承門市常規時段供應中'::TEXT;
            RETURN;
        END IF;
    END IF;

    RETURN QUERY SELECT p_item_id, FALSE, NULL::VARCHAR, '該品項目前非供應時段'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- STEP 8. 執行驗證查詢 (直接於 Supabase SQL Editor 檢視成果)
-- ------------------------------------------------------------------------------

-- 8.1 驗證菜單主檔與排程時段統計
SELECT 
    m.id AS menu_id,
    m.title->'translations'->>'zh' AS menu_title,
    m.is_active,
    m.category_ids,
    COUNT(DISTINCT msa.id) AS active_days_count,
    COUNT(tp.id) AS total_periods_count
FROM public.menus m
LEFT JOIN public.menu_service_availabilities msa ON m.id = msa.menu_id
LEFT JOIN public.menu_time_periods tp ON msa.id = tp.availability_id
GROUP BY m.id, m.title, m.is_active, m.category_ids
ORDER BY m.id;

-- 8.2 驗證商品品項與分類勾稽關聯
SELECT 
    i.id AS item_id,
    i.title->'translations'->>'zh' AS item_name,
    i.price_info->>'formatted_price' AS price,
    c.id AS category_id,
    c.title->'translations'->>'zh' AS category_name,
    mc.menu_id AS bound_menu_id
FROM public.items i
CROSS JOIN LATERAL (
    SELECT c.id, c.title 
    FROM public.categories c 
    WHERE c.entities @> jsonb_build_array(jsonb_build_object('id', i.id))
) c
LEFT JOIN public.menu_categories mc ON c.id = mc.category_id
ORDER BY mc.menu_id, c.id, i.id;

-- 8.3 驗證即時營業時段計算函數 (測試：週四 14:00 台北時間，預期 store_hours 營業中)
SELECT * FROM public.fn_check_menu_status('store_hours', '2026-09-03 14:00:00+08', 'Asia/Taipei');

-- 8.4 驗證商品供應勾稽判定 (測試：阿薩姆紅茶 item_black_tea 於週四 14:00，預期為 true)
SELECT * FROM public.fn_check_item_availability('item_black_tea', '2026-09-03 14:00:00+08', 'Asia/Taipei');
