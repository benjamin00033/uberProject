export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  progress: number;  // 0-100
  milestones: string[];
}

export interface Member {
  id: string;
  name: string;
  role: string;      // e.g., '前端工程師', '後端工程師', 'QA', 'UI 設計師'
  avatar?: string;
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  assignees: string[]; // member ids
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  status: 'todo' | 'in_progress' | 'done';
}

export interface ConflictWarning {
  memberId: string;
  memberName: string;
  date: string; // the conflicting date or date range
  overlappingTasks: Task[];
}

export interface Holiday {
  date: string; // "20260101"
  week: string; // "四"
  isHoliday: boolean;
  description: string;
}
