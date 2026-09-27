import { ref } from "vue";

export function useDashboardPage() {
  const isTaskModalOpen = ref(false);
  const editTaskId = ref<string | undefined>(undefined);
  const isProjectModalOpen = ref(false);
  const isCalendarMode = ref(false);

  const openNewTaskModal = () => {
    editTaskId.value = undefined;
    isTaskModalOpen.value = true;
  };

  const openEditTaskModal = (taskId: string) => {
    editTaskId.value = taskId;
    isTaskModalOpen.value = true;
  };

  return {
    isTaskModalOpen,
    editTaskId,
    isProjectModalOpen,
    isCalendarMode,
    openNewTaskModal,
    openEditTaskModal,
  };
}
