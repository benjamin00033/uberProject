<template>
  <BaseModal :is-open="isOpen" :title="title" @update:isOpen="emit('update:isOpen', $event)" @close="close">
    <div v-if="!editingProject && !isCreating">
      <ion-list>
        <ion-item v-for="p in projects" :key="p.id">
          <ion-label>
            <h2>{{ p.name }}</h2>
            <p>{{ p.startDate }} ~ {{ p.endDate }}</p>
          </ion-label>
          <ion-button slot="end" fill="clear" @click="startEdit(p)">編輯</ion-button>
          <ion-button slot="end" fill="clear" color="danger" @click="deleteProject(p.id)">刪除</ion-button>
        </ion-item>
        <ion-item v-if="projects.length === 0">
          <ion-label color="medium">目前無專案</ion-label>
        </ion-item>
      </ion-list>
      <div class="ion-padding">
        <ion-button expand="block" @click="startCreate">新增專案</ion-button>
      </div>
    </div>

    <form v-else @submit.prevent="saveProject">
      <ion-item>
        <ion-input
          label="專案名稱"
          label-placement="stacked"
          v-model="formData.name"
          required
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-input
          label="專案描述"
          label-placement="stacked"
          v-model="formData.description"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-input
          type="date"
          label="開始日期"
          label-placement="stacked"
          v-model="formData.startDate"
          required
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-input
          type="date"
          label="結束日期"
          label-placement="stacked"
          v-model="formData.endDate"
          required
        ></ion-input>
      </ion-item>
      <div class="ion-padding">
        <ion-button color="medium" fill="clear" @click="cancelEdit">取消</ion-button>
        <ion-button color="primary" type="submit" :disabled="!isValid">儲存</ion-button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { IonList, IonItem, IonLabel, IonButton, IonInput } from "@ionic/vue";
import BaseModal from "@/components/UI/BaseModal.vue";
import { useProjectSchedulerStore } from "../store/useProjectSchedulerStore";
import { storeToRefs } from "pinia";
import type { Project } from "../types";

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["update:isOpen"]);

const store = useProjectSchedulerStore();
const { projects } = storeToRefs(store);

const isCreating = ref(false);
const editingProject = ref<Project | null>(null);

const title = computed(() => {
  if (isCreating.value) return "新增專案";
  if (editingProject.value) return "編輯專案";
  return "專案管理";
});

const getInitialData = () => ({
  name: "",
  description: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0],
  progress: 0,
  milestones: []
});

const formData = ref(getInitialData());

const isValid = computed(() => {
  return formData.value.name.trim() !== "" &&
         formData.value.startDate !== "" &&
         formData.value.endDate !== "" &&
         formData.value.startDate <= formData.value.endDate;
});

const startCreate = () => {
  isCreating.value = true;
  editingProject.value = null;
  formData.value = getInitialData();
};

const startEdit = (p: Project) => {
  isCreating.value = false;
  editingProject.value = p;
  formData.value = { ...p };
};

const cancelEdit = () => {
  isCreating.value = false;
  editingProject.value = null;
};

const saveProject = () => {
  if (!isValid.value) return;
  if (editingProject.value) {
    store.updateProject(editingProject.value.id, formData.value);
  } else {
    store.addProject(formData.value);
  }
  cancelEdit();
};

const deleteProject = (id: string) => {
  if (confirm("確定要刪除此專案與相關任務嗎？")) {
    store.deleteProject(id);
  }
};

const close = () => {
  cancelEdit();
  emit("update:isOpen", false);
};

watch(() => props.isOpen, (val) => {
  if (!val) cancelEdit();
});
</script>
