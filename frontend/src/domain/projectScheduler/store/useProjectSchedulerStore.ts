import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { Project, Member, Task, ConflictWarning, Holiday } from "../types";

/**
 * 管理專案、成員與任務狀態，並自動計算人力調度衝突的 Pinia Store
 */
export const useProjectSchedulerStore = defineStore("projectScheduler", () => {
  const projects = ref<Project[]>([
    {
      id: "p1",
      name: "A 專案 - 系統重構",
      description: "",
      startDate: "2026-08-01",
      endDate: "2026-09-15",
      progress: 65,
      milestones: ["需求訪談", "UI設計", "開發中"],
    },
    {
      id: "p2",
      name: "B 專案 - 新功能開發",
      description: "",
      startDate: "2026-08-10",
      endDate: "2026-08-30",
      progress: 30,
      milestones: ["規格確認", "開發中"],
    },
  ]);

  const members = ref<Member[]>([
    { id: "m1", name: "Alice", role: "前端工程師" },
    { id: "m2", name: "Bob", role: "後端工程師" },
    { id: "m3", name: "Charlie", role: "UI 設計師" },
    { id: "m4", name: "Dave", role: "QA" },
  ]);

  const tasks = ref<Task[]>([
    {
      id: "t1",
      projectId: "p1",
      name: "首頁重構",
      assignees: ["m1"],
      startDate: "2026-08-15",
      endDate: "2026-08-20",
      status: "in_progress",
    },
    {
      id: "t2",
      projectId: "p2",
      name: "Dashboard 開發",
      assignees: ["m1"],
      startDate: "2026-08-18",
      endDate: "2026-08-25",
      status: "todo",
    }, // Conflict! Alice is double-booked
    {
      id: "t3",
      projectId: "p1",
      name: "資料庫遷移",
      assignees: ["m2"],
      startDate: "2026-08-15",
      endDate: "2026-08-25",
      status: "in_progress",
    },
    {
      id: "t4",
      projectId: "p1",
      name: "設計規範更新",
      assignees: ["m3"],
      startDate: "2026-08-10",
      endDate: "2026-08-16",
      status: "done",
    },
    {
      id: "t5",
      projectId: "p2",
      name: "今日焦點任務",
      assignees: ["m4"],
      startDate: new Date().toLocaleDateString("en-CA"),
      endDate: new Date().toLocaleDateString("en-CA"),
      status: "todo",
    },
  ]);

  const holidays = ref<Holiday[]>([]);
  const currentDate = ref(new Date());

  const fetchHolidays = async (year: number) => {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/ruyut/TaiwanCalendar/master/data/${year}.json`
      );
      if (res.ok) {
        holidays.value = await res.json();
      }
    } catch (error) {
      console.error("Failed to fetch holidays", error);
    }
  };

  watch(
    () => currentDate.value.getFullYear(),
    (year) => {
      fetchHolidays(year);
    },
    { immediate: true }
  );

  const getHolidayForDate = (dateStr: string) => {
    const yyyymmdd = dateStr.replace(/-/g, "");
    return holidays.value.find((h) => h.date === yyyymmdd && h.isHoliday);
  };

  const currentYearMonth = computed(() => {
    return `${currentDate.value.getFullYear()} 年 ${currentDate.value.getMonth() + 1} 月`;
  });

  const firstDayOffset = computed(() => {
    const d = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth(),
      1,
    );
    return d.getDay();
  });

  const daysInWeek = computed(() => {
    const todayStr = new Date().toLocaleDateString("en-CA");
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

    const d = new Date(currentDate.value);
    const day = d.getDay();
    const diff = d.getDate() - day; // Adjust to Sunday
    const startOfWeek = new Date(d.setDate(diff));

    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      const dateStr = currentDay.toLocaleDateString("en-CA");

      const dayTasks = tasks.value
        .filter((t) => t.startDate <= dateStr && t.endDate >= dateStr)
        .map((t) => ({
          ...t,
          isStart: t.startDate === dateStr,
          isEnd: t.endDate === dateStr,
        }));

      days.push({
        dayNumber: currentDay.getDate(),
        dateStr,
        weekStr: weekdays[currentDay.getDay()],
        isToday: dateStr === todayStr,
        holiday: getHolidayForDate(dateStr),
        tasks: dayTasks,
      });
    }
    return days;
  });

  const daysInMonth = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const numDays = new Date(year, month + 1, 0).getDate();
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

    const todayStr = new Date().toLocaleDateString("en-CA");

    const days = [];
    for (let i = 1; i <= numDays; i++) {
      const d = new Date(year, month, i);
      const dateStr = d.toLocaleDateString("en-CA");

      const dayTasks = tasks.value
        .filter((t) => t.startDate <= dateStr && t.endDate >= dateStr)
        .map((t) => ({
          ...t,
          isStart: t.startDate === dateStr,
          isEnd: t.endDate === dateStr,
        }));

      days.push({
        dayNumber: i,
        dateStr,
        weekStr: weekdays[d.getDay()],
        isToday: dateStr === todayStr,
        holiday: getHolidayForDate(dateStr),
        tasks: dayTasks,
      });
    }
    return days;
  });

  const prevMonth = () => {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() - 1,
      1,
    );
  };

  const nextMonth = () => {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1,
      1,
    );
  };

  const prevWeek = () => {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth(),
      currentDate.value.getDate() - 7,
    );
  };

  const nextWeek = () => {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth(),
      currentDate.value.getDate() + 7,
    );
  };

  const conflicts = computed<ConflictWarning[]>(() => {
    const warnings: ConflictWarning[] = [];
    members.value.forEach((m) => {
      const memberTasks = tasks.value.filter((t) => t.assignees.includes(m.id));
      for (let i = 0; i < memberTasks.length; i++) {
        for (let j = i + 1; j < memberTasks.length; j++) {
          const t1 = memberTasks[i];
          const t2 = memberTasks[j];
          if (t1.startDate <= t2.endDate && t1.endDate >= t2.startDate) {
            warnings.push({
              memberId: m.id,
              memberName: m.name,
              date: `${Math.max(new Date(t1.startDate).getTime(), new Date(t2.startDate).getTime())}`,
              overlappingTasks: [t1, t2],
            });
          }
        }
      }
    });
    return warnings;
  });

  const getTasksForMember = (memberId: string) => {
    return tasks.value.filter((t) => t.assignees.includes(memberId));
  };

  const isTaskConflicting = (taskId: string) => {
    return conflicts.value.some((c) =>
      c.overlappingTasks.some((t) => t.id === taskId),
    );
  };

  const todayTasks = computed(() => {
    const today = new Date().toLocaleDateString("en-CA");
    return tasks.value.filter(
      (t) => t.startDate <= today && t.endDate >= today,
    );
  });

  const getProjectProgress = (projectId: string) => {
    const pTasks = tasks.value.filter((t) => t.projectId === projectId);
    if (pTasks.length === 0) return 0;
    const doneTasks = pTasks.filter((t) => t.status === "done").length;
    return Math.round((doneTasks / pTasks.length) * 100);
  };

  const getProjectName = (projectId: string) =>
    projects.value.find((p) => p.id === projectId)?.name || "";

  const getAssigneeNames = (assigneeIds: string[]) =>
    assigneeIds
      .map((id) => members.value.find((m) => m.id === id)?.name)
      .join(", ");

  const addTask = (task: Omit<Task, "id">) => {
    const newId = `t${Date.now()}`;
    tasks.value.push({ ...task, id: newId });
  };

  const updateTaskStatus = (taskId: string, status: Task["status"]) => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
    }
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const t = tasks.value.find((t) => t.id === taskId);
    if (t) {
      Object.assign(t, updates);
    }
  };

  const deleteTask = (taskId: string) => {
    tasks.value = tasks.value.filter((t) => t.id !== taskId);
  };

  const toggleTaskStatus = (taskId: string) => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task) {
      if (task.status === "todo") {
        task.status = "in_progress";
      } else if (task.status === "in_progress") {
        task.status = "done";
      } else {
        task.status = "todo";
      }
    }
  };

  const addProject = (project: Omit<Project, "id">) => {
    const newId = `p${Date.now()}`;
    projects.value.push({ ...project, id: newId });
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    const p = projects.value.find((p) => p.id === projectId);
    if (p) {
      Object.assign(p, updates);
    }
  };

  const deleteProject = (projectId: string) => {
    projects.value = projects.value.filter((p) => p.id !== projectId);
    // Also remove tasks associated with the project
    tasks.value = tasks.value.filter((t) => t.projectId !== projectId);
  };

  const updateTaskDates = (taskId: string, startDate: string, endDate: string) => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task) {
      task.startDate = startDate;
      task.endDate = endDate;
    }
  };

  const getMemberTaskLanes = (memberId: string) => {
    const memberTasks = getTasksForMember(memberId).filter((task) => {
      if (daysInWeek.value.length === 0) return false;
      const weekStart = new Date(daysInWeek.value[0].dateStr).getTime();
      const weekEnd =
        new Date(
          daysInWeek.value[daysInWeek.value.length - 1].dateStr,
        ).getTime() +
        24 * 3600 * 1000 -
        1;
      const taskStart = new Date(task.startDate).getTime();
      const taskEnd = new Date(task.endDate).getTime() + 24 * 3600 * 1000 - 1;
      return taskStart <= weekEnd && taskEnd >= weekStart;
    });

    memberTasks.sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

    const lanes: Task[][] = [];
    const taskLaneMap = new Map<string, number>();

    for (const task of memberTasks) {
      let placed = false;
      for (let i = 0; i < lanes.length; i++) {
        const lane = lanes[i];
        const lastTask = lane[lane.length - 1];
        if (
          new Date(lastTask.endDate).getTime() <
          new Date(task.startDate).getTime()
        ) {
          lane.push(task);
          taskLaneMap.set(task.id, i);
          placed = true;
          break;
        }
      }
      if (!placed) {
        lanes.push([task]);
        taskLaneMap.set(task.id, lanes.length - 1);
      }
    }

    return { lanes, taskLaneMap, maxLanes: lanes.length };
  };

  const memberLanes = computed(() => {
    const map = new Map<
      string,
      { taskLaneMap: Map<string, number>; maxLanes: number }
    >();
    for (const member of members.value) {
      map.set(member.id, getMemberTaskLanes(member.id));
    }
    return map;
  });

  return {
    projects,
    members,
    tasks,
    conflicts,
    todayTasks,
    currentDate,
    currentYearMonth,
    firstDayOffset,
    daysInMonth,
    prevMonth,
    nextMonth,
    daysInWeek,
    prevWeek,
    nextWeek,
    getTasksForMember,
    isTaskConflicting,
    getProjectName,
    getProjectProgress,
    getAssigneeNames,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    toggleTaskStatus,
    addProject,
    updateProject,
    deleteProject,
    updateTaskDates,
    getMemberTaskLanes,
    memberLanes,
  };
});
