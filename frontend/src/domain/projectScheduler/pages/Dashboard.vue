<template>
  <FlexBoardLayout>
    <template #header>
      <ion-header>
        <ion-toolbar>
          <ion-title>
            <ion-icon :icon="calendarOutline" class="ion-margin-end"></ion-icon>
            {{ $t("projectScheduler.page.title") }}
          </ion-title>
          <ion-buttons slot="end">
            <!-- View Mode Toggle -->
            <ion-button
              @click="isCalendarMode = !isCalendarMode"
              color="secondary"
              fill="clear"
            >
              <ion-icon
                :icon="isCalendarMode ? listOutline : calendarNumberOutline"
                slot="start"
              ></ion-icon>
              {{ isCalendarMode ? "切換列表模式" : "切換月曆模式" }}
            </ion-button>

            <ion-button
              @click="isProjectModalOpen = true"
              color="tertiary"
              fill="clear"
            >
              <ion-icon :icon="folderOpenOutline" slot="start"></ion-icon>
              專案管理
            </ion-button>

            <ion-button
              @click="openNewTaskModal"
              color="primary"
              fill="solid"
              shape="round"
            >
              <ion-icon :icon="addOutline" slot="start"></ion-icon>
              新增任務
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
    </template>

    <template v-if="!isCalendarMode">
      <!-- 專案總覽區 -->
      <ion-card :class="$style.bentoCard">
        <ion-card-header>
          <ion-card-title>{{
            $t("projectScheduler.page.projectOverview")
          }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row
              v-for="project in projects"
              :key="project.id"
              class="ion-align-items-center ion-margin-bottom"
            >
              <ion-col size="3">
                <strong>{{ project.name }}</strong>
                <div :class="['text-muted', $style.smallText]">
                  {{ project.startDate }} ~ {{ project.endDate }}
                </div>
              </ion-col>
              <ion-col size="6">
                <ion-progress-bar
                  :value="getProjectProgress(project.id) / 100"
                  color="primary"
                ></ion-progress-bar>
                <div :class="$style.progressText">
                  {{
                    $t("projectScheduler.page.progressText", {
                      progress: getProjectProgress(project.id),
                    })
                  }}
                </div>
              </ion-col>
              <ion-col size="3">
                <ion-badge color="tertiary" class="ion-margin-end">
                  {{
                    $t("projectScheduler.page.currentMilestone", {
                      milestone:
                        project.milestones[project.milestones.length - 1],
                    })
                  }}
                </ion-badge>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>

      <!-- 資源時程月曆 -->
      <ion-card :class="[$style.bentoCard, $style.fullHeightCard]">
        <ion-card-header>
          <ion-card-title>{{
            $t("projectScheduler.page.timelineTitle")
          }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <!-- 撞期警告區塊 -->
          <div v-if="conflicts.length > 0" :class="$style.conflictAlert">
            <ion-icon :icon="warningOutline" size="large"></ion-icon>
            <div :class="$style.conflictMessage">
              <strong>{{
                $t("projectScheduler.page.conflictAlert", {
                  count: conflicts.length,
                })
              }}</strong>
              <div v-for="(conflict, idx) in conflicts" :key="idx">
                {{
                  $t("projectScheduler.page.conflictDetail", {
                    name: conflict.memberName,
                  })
                }}
                {{
                  conflict.overlappingTasks
                    .map((t) => t.name)
                    .join($t("projectScheduler.page.and"))
                }}
              </div>
            </div>
          </div>

          <!-- 時程表模擬呈現 -->
          <div :class="$style.timelineContainer" ref="timelineContainerRef">
            <div :class="$style.timelineHeader">
              <div :class="$style.memberColumn">
                <ion-button fill="clear" @click="prevWeek" size="small">
                  <ion-icon :icon="chevronBackOutline"></ion-icon>
                </ion-button>
                {{ currentYearMonth }}
                <ion-button fill="clear" @click="nextWeek" size="small">
                  <ion-icon :icon="chevronForwardOutline"></ion-icon>
                </ion-button>
              </div>
              <div :class="$style.daysHeader">
                <div
                  v-for="day in daysInWeek"
                  :key="day.dateStr"
                  :class="[
                    $style.dateColumn,
                    { [$style.holidayCol]: day.holiday },
                  ]"
                >
                  <div>{{ day.dayNumber }} ({{ day.weekStr }})</div>
                  <div v-if="day.holiday" :class="$style.holidayTag">
                    {{ day.holiday.description || "假日" }}
                  </div>
                </div>
              </div>
            </div>

            <div
              v-for="member in members"
              :key="member.id"
              :class="$style.timelineRow"
            >
              <div :class="$style.memberColumn">
                <strong>{{ member.name }}</strong>
                <div :class="$style.memberRole">{{ member.role }}</div>
              </div>
              <div
                :class="$style.timelineTracks"
                :style="getTrackStyle(member.id)"
              >
                <div :class="$style.dayCellsContainer">
                  <div
                    v-for="day in daysInWeek"
                    :key="day.dateStr"
                    :class="[
                      $style.dayCell,
                      'pnd-day-cell',
                      { [$style.holidayCell]: day.holiday },
                    ]"
                    :data-date="day.dateStr"
                  ></div>
                </div>

                <div
                  v-for="task in getTasksForMember(member.id)"
                  :key="task.id"
                  :class="[
                    $style.taskBar,
                    'pnd-task-bar',
                    { [$style.conflictBar]: isTaskConflicting(task.id) },
                  ]"
                  :style="getTaskStyle(task, member.id)"
                  :data-task-id="task.id"
                  :data-source-date="task.startDate"
                  @click="openEditTaskModal(task.id)"
                  :title="`專案：${getProjectName(task.projectId)}\n日期：${task.startDate} ~ ${task.endDate}\n狀態：${$t('projectScheduler.status.' + task.status)}`"
                >
                  <ion-icon
                    v-if="isTaskConflicting(task.id)"
                    :icon="alertCircleOutline"
                    class="ion-margin-end"
                  ></ion-icon>
                  <span>{{ task.name }}</span>
                  <ion-icon
                    :icon="createOutline"
                    :class="$style.editIcon"
                  ></ion-icon>
                </div>
              </div>
            </div>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- 今日焦點 -->
      <ion-card :class="[$style.bentoCard, $style.fullHeightCard]">
        <ion-card-header>
          <ion-card-title>{{
            $t("projectScheduler.page.todaysFocus")
          }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="full">
            <ion-item v-for="task in todayTasks" :key="task.id">
              <ion-label
                @click="openEditTaskModal(task.id)"
                style="cursor: pointer"
              >
                <h2>{{ task.name }}</h2>
                <p>
                  {{
                    $t("projectScheduler.page.projectName", {
                      name: getProjectName(task.projectId),
                    })
                  }}
                </p>
                <p>
                  {{
                    $t("projectScheduler.page.assignee", {
                      name: getAssigneeNames(task.assignees),
                    })
                  }}
                </p>
              </ion-label>
              <ion-badge
                :color="
                  task.status === 'done'
                    ? 'success'
                    : task.status === 'in_progress'
                      ? 'warning'
                      : 'medium'
                "
                :class="$style.clickableBadge"
                @click="toggleTaskStatus(task.id)"
              >
                {{ $t(`projectScheduler.status.${task.status}`) }}
              </ion-badge>
            </ion-item>
            <ion-item v-if="todayTasks.length === 0">
              <ion-label color="medium">{{
                $t("projectScheduler.page.noTasksToday")
              }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </template>
    <template v-else>
      <ion-card :class="[$style.bentoCard, $style.fullHeightCard]">
        <ion-card-content :class="$style.noPadding">
          <CalendarView @edit-task="openEditTaskModal" />
        </ion-card-content>
      </ion-card>
    </template>
    <TaskModal v-model:isOpen="isTaskModalOpen" :editTaskId="editTaskId" />
    <ProjectManagerModal v-model:isOpen="isProjectModalOpen" />
  </FlexBoardLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import FlexBoardLayout from "@/components/Layout/FlexBoardLayout.vue";
import TaskModal from "../components/TaskModal.vue";
import ProjectManagerModal from "../components/ProjectManagerModal.vue";
import CalendarView from "../components/CalendarView.vue";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonProgressBar,
  IonBadge,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
} from "@ionic/vue";
import {
  calendarOutline,
  warningOutline,
  alertCircleOutline,
  addOutline,
  listOutline,
  calendarNumberOutline,
  folderOpenOutline,
  chevronBackOutline,
  chevronForwardOutline,
  createOutline,
} from "ionicons/icons";
import { useProjectSchedulerStore } from "../store/useProjectSchedulerStore";
import { useDashboardPage } from "../composables/useDashboardPage";
import { useTimelineStyles } from "../composables/useTimelineStyles";

const store = useProjectSchedulerStore();

// 要解構 State 或 Getters 時：如果你直接用 const { name } = useUserStore()，資料會失去響應式。
// 你必須寫 const { name } = storeToRefs(useUserStore())。讓資料可直接在畫面中使用：轉成 ref 後，你就能直接在 <template> 裡綁定變數（例如 {{ name }}）

// 動態變數
const {
  projects,
  members,
  conflicts,
  todayTasks,
  currentYearMonth,
  daysInWeek,
  tasks,
  memberLanes,
} = storeToRefs(store);

// 方法
const {
  getTasksForMember,
  isTaskConflicting,
  getProjectName,
  getProjectProgress,
  getAssigneeNames,
  toggleTaskStatus,
  prevWeek,
  nextWeek,
  updateTaskDates,
} = store;

// composables
const {
  isTaskModalOpen,
  editTaskId,
  isProjectModalOpen,
  isCalendarMode,
  openNewTaskModal,
  openEditTaskModal,
} = useDashboardPage();

// composables
const { timelineContainerRef, getTaskStyle, getTrackStyle } = useTimelineStyles(
  {
    daysInWeek,
    memberLanes,
    tasks,
    updateTaskDates,
  },
);
</script>

<style lang="scss" module src="./Dashboard.module.scss"></style>
