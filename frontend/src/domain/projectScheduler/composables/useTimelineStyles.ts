import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
// import type { ComputedRef } from "vue-tsc";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { Task, Holiday } from "../types";

export function useTimelineStyles(store: {
  daysInWeek: ComputedRef<{ dateStr: string; holiday?: Holiday }[]>;
  memberLanes: ComputedRef<
    Map<string, { taskLaneMap: Map<string, number>; maxLanes: number }>
  >;
  tasks: ComputedRef<Task[]>;
  updateTaskDates: (taskId: string, startDate: string, endDate: string) => void;
}) {
  const timelineContainerRef = ref<HTMLElement | null>(null);
  let cleanupFns: Array<() => void> = [];

  const getTaskStyle = (task: Task, memberId: string) => {
    if (store.daysInWeek.value.length === 0) return { display: "none" };

    const weekStart = new Date(store.daysInWeek.value[0].dateStr).getTime();
    const weekEnd =
      new Date(
        store.daysInWeek.value[store.daysInWeek.value.length - 1].dateStr,
      ).getTime() +
      24 * 3600 * 1000 -
      1;

    const taskStart = new Date(task.startDate).getTime();
    const taskEnd = new Date(task.endDate).getTime() + 24 * 3600 * 1000 - 1;

    const actualStartMs = Math.max(weekStart, taskStart);
    const actualEndMs = Math.min(weekEnd, taskEnd);

    if (actualStartMs > weekEnd || actualEndMs < weekStart) {
      return { display: "none" };
    }

    const totalWeekMs = 7 * 24 * 3600 * 1000;
    const leftPercent = ((actualStartMs - weekStart) / totalWeekMs) * 100;
    const widthPercent =
      ((actualEndMs - actualStartMs + 1) / totalWeekMs) * 100;

    const laneInfo = store.memberLanes.value.get(memberId);
    const laneIndex = laneInfo?.taskLaneMap.get(task.id) || 0;

    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
      top: `${4 + laneIndex * 36}px`,
    };
  };

  const getTrackStyle = (memberId: string) => {
    const laneInfo = store.memberLanes.value.get(memberId);
    const maxLanes = laneInfo?.maxLanes || 1;
    const height = Math.max(40, maxLanes * 36 + 8);
    return { minHeight: `${height}px` };
  };

  const bindDragAndDrop = () => {
    cleanupFns.forEach((fn) => fn());
    cleanupFns = [];

    if (!timelineContainerRef.value) return;

    const taskBars =
      timelineContainerRef.value.querySelectorAll(".pnd-task-bar");
    taskBars.forEach((el) => {
      const taskId = el.getAttribute("data-task-id");
      const sourceDate = el.getAttribute("data-source-date");
      if (taskId && sourceDate) {
        cleanupFns.push(
          draggable({
            element: el as HTMLElement,
            getInitialData() {
              return { taskId, sourceDate };
            },
          }),
        );
      }
    });

    const dayCells =
      timelineContainerRef.value.querySelectorAll(".pnd-day-cell");
    dayCells.forEach((el) => {
      const targetDateStr = el.getAttribute("data-date");
      if (targetDateStr) {
        cleanupFns.push(
          dropTargetForElements({
            element: el as HTMLElement,
            onDrop({ source }) {
              const taskId = source.data.taskId as string;
              const sourceDateStr = source.data.sourceDate as string;
              if (taskId && sourceDateStr && sourceDateStr !== targetDateStr) {
                const sourceDate = new Date(sourceDateStr);
                const targetDate = new Date(targetDateStr);
                const diffTime = targetDate.getTime() - sourceDate.getTime();

                const task = store.tasks.value.find((t) => t.id === taskId);
                if (!task) return;

                const newStart = new Date(
                  new Date(task.startDate).getTime() + diffTime,
                ).toLocaleDateString("en-CA");
                const newEnd = new Date(
                  new Date(task.endDate).getTime() + diffTime,
                ).toLocaleDateString("en-CA");

                store.updateTaskDates(taskId, newStart, newEnd);
              }
            },
          }),
        );
      }
    });
  };

  watch(
    [() => store.daysInWeek.value, () => store.tasks.value],
    () => {
      nextTick(() => {
        bindDragAndDrop();
      });
    },
    { deep: true },
  );

  onMounted(() => {
    nextTick(() => {
      bindDragAndDrop();
    });
  });

  onUnmounted(() => {
    cleanupFns.forEach((fn) => fn());
  });

  return {
    timelineContainerRef,
    getTaskStyle,
    getTrackStyle,
  };
}
