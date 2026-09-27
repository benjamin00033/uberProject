<template>
  <BaseModal :is-open="isOpen" :title="title" @update:isOpen="emit('update:isOpen', $event)" @close="close">
    <form @submit.prevent="submitForm">
      <ion-item>
        <ion-input
          label="任務名稱 (Task Name)"
          label-placement="stacked"
          v-model="formData.name"
          placeholder="請輸入任務名稱"
          required
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-select
          label="所屬專案 (Project)"
          label-placement="stacked"
          v-model="formData.projectId"
          placeholder="請選擇專案"
          required
        >
          <ion-select-option v-for="p in projects" :key="p.id" :value="p.id">
            {{ p.name }}
          </ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-select
          label="指派成員 (Assignees)"
          label-placement="stacked"
          v-model="formData.assignees"
          :multiple="true"
          placeholder="請選擇負責人"
          required
        >
          <ion-select-option v-for="m in members" :key="m.id" :value="m.id">
            {{ m.name }} ({{ m.role }})
          </ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-input
          type="date"
          label="開始日期 (Start Date)"
          label-placement="stacked"
          v-model="formData.startDate"
          required
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-input
          type="date"
          label="結束日期 (End Date)"
          label-placement="stacked"
          v-model="formData.endDate"
          required
        ></ion-input>
      </ion-item>
      <ion-item v-if="editTaskId">
        <ion-select
          label="狀態 (Status)"
          label-placement="stacked"
          v-model="formData.status"
          required
        >
          <ion-select-option value="todo">{{ $t('projectScheduler.status.todo') }}</ion-select-option>
          <ion-select-option value="in_progress">{{ $t('projectScheduler.status.in_progress') }}</ion-select-option>
          <ion-select-option value="done">{{ $t('projectScheduler.status.done') }}</ion-select-option>
        </ion-select>
      </ion-item>
    </form>

    <template #footer>
      <div class="ion-text-right ion-padding-end ion-padding-bottom" style="display: flex; justify-content: space-between; align-items: center;">
        <ion-button v-if="editTaskId" color="danger" fill="clear" @click="handleDelete">刪除任務</ion-button>
        <div v-else></div>
        <div>
          <ion-button color="medium" fill="clear" @click="close">取消</ion-button>
          <ion-button color="primary" @click="submitForm" :disabled="!isValid">儲存</ion-button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { IonItem, IonInput, IonSelect, IonSelectOption, IonButton } from "@ionic/vue";
import BaseModal from "@/components/UI/BaseModal.vue";
import type { Task } from "../types";
import { useProjectSchedulerStore } from "../store/useProjectSchedulerStore";
import { storeToRefs } from "pinia";

const props = defineProps<{
  isOpen: boolean;
  editTaskId?: string;
}>();

const emit = defineEmits(["update:isOpen"]);

const store = useProjectSchedulerStore();
const { projects, members, tasks } = storeToRefs(store);

const title = computed(() => (props.editTaskId ? "編輯任務" : "新增任務"));

const getInitialData = () => ({
  name: "",
  projectId: "",
  assignees: [] as string[],
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
  status: "todo" as Task["status"],
});

const formData = ref(getInitialData());

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.editTaskId) {
      const task = tasks.value.find((t) => t.id === props.editTaskId);
      if (task) {
        formData.value = { ...task, assignees: [...task.assignees] };
        return;
      }
    }
    formData.value = getInitialData();
  }
});

const isValid = computed(() => {
  return (
    formData.value.name.trim() !== "" &&
    formData.value.projectId !== "" &&
    formData.value.assignees.length > 0 &&
    formData.value.startDate !== "" &&
    formData.value.endDate !== "" &&
    formData.value.startDate <= formData.value.endDate
  );
});

const close = () => {
  emit("update:isOpen", false);
};

const submitForm = () => {
  if (!isValid.value) return;
  if (props.editTaskId) {
    store.updateTask(props.editTaskId, formData.value);
  } else {
    store.addTask(formData.value);
  }
  close();
};

const handleDelete = () => {
  if (props.editTaskId) {
    store.deleteTask(props.editTaskId);
    close();
  }
};
</script>
