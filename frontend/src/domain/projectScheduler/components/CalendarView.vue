<template>
  <div :class="$style.calendarContainer">
    <div :class="$style.header">
      <ion-button fill="clear" @click="prevMonth">
        <ion-icon :icon="chevronBackOutline"></ion-icon>
      </ion-button>
      <h2>{{ currentYearMonth }}</h2>
      <ion-button fill="clear" @click="nextMonth">
        <ion-icon :icon="chevronForwardOutline"></ion-icon>
      </ion-button>
    </div>

    <div :class="$style.weekdays">
      <div v-for="day in weekdays" :key="day" :class="$style.weekday">
        {{ day }}
      </div>
    </div>

    <div :class="$style.grid">
      <!-- Empty padding for first day offset -->
      <div
        v-for="blank in firstDayOffset"
        :key="'blank-' + blank"
        :class="$style.cell"
      ></div>

      <!-- Actual days -->
      <div
        v-for="day in daysInMonth"
        :key="day.dateStr"
        :class="[$style.cell, 'pnd-calendar-day-cell', { [$style.today]: day.isToday, [$style.holidayCell]: day.holiday }]"
        :data-date="day.dateStr"
      >
        <div class="date-header">
          <span :class="['date-number', { 'is-today': day.isToday, 'is-holiday': day.holiday }]">
            {{ day.dayNumber }}
          </span>
          <span v-if="day.holiday" class="holiday-name">
            {{ day.holiday.description || '假日' }}
          </span>
        </div>

        <div :class="$style.tasksList">
          <div
            v-for="task in day.tasks"
            :key="task.id"
            :class="[
              $style.taskChip,
              'pnd-calendar-task-chip',
              task.isStart ? $style.taskStart : '',
              task.isEnd ? $style.taskEnd : '',
              isTaskConflicting(task.id) ? $style.taskConflict : '',
            ]"
            :data-task-id="task.id"
            :data-source-date="day.dateStr"
            @click.stop="emit('edit-task', task.id)"
            :title="`專案：${getProjectName(task.projectId)}\n日期：${task.startDate} ~ ${task.endDate}\n狀態：${$t('projectScheduler.status.' + task.status)}`"
          >
            {{ task.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { IonButton, IonIcon } from "@ionic/vue";
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";
import { useProjectSchedulerStore } from "../store/useProjectSchedulerStore";
import { storeToRefs } from "pinia";
import type { Task } from "../types";
import $style from "./CalendarView.module.scss";

const emit = defineEmits<{
  (e: 'edit-task', taskId: string): void;
}>();

const store = useProjectSchedulerStore();
const { tasks, currentYearMonth, firstDayOffset, daysInMonth } = storeToRefs(store);
const { isTaskConflicting, updateTaskDates, prevMonth, nextMonth, getProjectName } = store;

const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

// Pragmatic drag and drop logic
let cleanupFns: Array<() => void> = [];

const bindDragAndDrop = () => {
  cleanupFns.forEach(fn => fn());
  cleanupFns = [];

  const taskChips = document.querySelectorAll('.pnd-calendar-task-chip');
  taskChips.forEach((el) => {
    const taskId = el.getAttribute('data-task-id');
    const sourceDate = el.getAttribute('data-source-date');
    if (taskId && sourceDate) {
      cleanupFns.push(
        draggable({
          element: el as HTMLElement,
          getInitialData() {
            return { taskId, sourceDate };
          },
        })
      );
    }
  });

  const dayCells = document.querySelectorAll('.pnd-calendar-day-cell');
  dayCells.forEach((el) => {
    const targetDateStr = el.getAttribute('data-date');
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
              
              const task = tasks.value.find((t) => t.id === taskId);
              if (!task) return;
              
              const newStart = new Date(
                new Date(task.startDate).getTime() + diffTime,
              ).toLocaleDateString("en-CA");
              const newEnd = new Date(
                new Date(task.endDate).getTime() + diffTime,
              ).toLocaleDateString("en-CA");
              
              updateTaskDates(taskId, newStart, newEnd);
            }
          },
        })
      );
    }
  });
};

watch([() => daysInMonth.value, () => tasks.value], () => {
  nextTick(() => {
    bindDragAndDrop();
  });
}, { deep: true });

onMounted(() => {
  nextTick(() => {
    bindDragAndDrop();
  });
});

onUnmounted(() => {
  cleanupFns.forEach(fn => fn());
});
</script>
