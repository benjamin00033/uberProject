<template>
  <div :class="$style.pagination">
    <button
      :class="$style.paginationBtn"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      {{ t('basePagination.prev') }}
    </button>
    <div :class="$style.paginationInfo">
      <span>{{ t('basePagination.info', { current: currentPage, total: totalPages }) }}</span>
    </div>
    <button
      :class="$style.paginationBtn"
      :disabled="currentPage === totalPages || totalPages === 0"
      @click="changePage(currentPage + 1)"
    >
      {{ t('basePagination.next') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  currentPage: number;
  totalItems: number;
  pageSize: number;
}>();

const emit = defineEmits<{
  (e: "update:currentPage", page: number): void;
  (e: "page-change", page: number): void;
}>();

const totalPages = computed(
  () => Math.ceil(props.totalItems / props.pageSize) || 1,
);

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit("update:currentPage", page);
    emit("page-change", page);
  }
};
</script>

<style lang="scss" module src="./BasePagination.module.scss"></style>
