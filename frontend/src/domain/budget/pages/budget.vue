<template>
  <h1>Hello</h1>
</template>

<script setup lang="ts">
import SingleColumnLayout from "@/components/Layout/SingleColumnLayout.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/vue";
import { add } from "ionicons/icons";
import { budgetApi } from "../services/budgetApi";
import $style from "./budget.module.scss";

const { t } = useI18n();
const queryClient = useQueryClient();

const { data: budgets, isLoading } = useQuery({
  queryKey: ["budgets"],
  queryFn: budgetApi.getBudgets,
});

const deleteMutation = useMutation({
  mutationFn: budgetApi.deleteBudget,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["budgets"] });
  },
});

const handleDelete = (id: string) => {
  if (confirm(t("budget.page.deleteConfirmMessage"))) {
    deleteMutation.mutate(id);
  }
};

const openAddModal = () => {
  alert(t("budget.page.addModalToImplement"));
};

// Derived Data for the Dashboard
// We mock "usedAmount" because the API doesn't provide it yet, just to make the UI look good.
const enrichedBudgets = computed(() => {
  if (!budgets.value) return [];
  return budgets.value.map((b) => {
    // Generate a consistent pseudo-random used amount based on ID for demo purposes
    const pseudoRandom =
      (b.id.charCodeAt(0) + b.id.charCodeAt(b.id.length - 1)) % 100;
    const progress = Math.max(10, pseudoRandom); // at least 10%
    const usedAmount = Math.round(b.amount * (progress / 100));
    return { ...b, usedAmount, progress };
  });
});

const totalBudget = computed(() =>
  enrichedBudgets.value.reduce((acc, curr) => acc + curr.amount, 0),
);
const totalUsed = computed(() =>
  enrichedBudgets.value.reduce((acc, curr) => acc + curr.usedAmount, 0),
);
const remainingBudget = computed(() =>
  Math.max(0, totalBudget.value - totalUsed.value),
);
const overallPercentage = computed(() => {
  if (totalBudget.value === 0) return 0;
  return Math.round((totalUsed.value / totalBudget.value) * 100);
});

// Chart segments logic
const colors = [
  "var(--ion-color-primary)",
  "var(--ion-color-secondary)",
  "var(--ion-color-success)",
  "var(--ion-color-warning)",
  "var(--ion-color-danger)",
];
const chartSegments = computed(() => {
  if (totalUsed.value === 0) return [];

  const categories = enrichedBudgets.value.reduce(
    (acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.usedAmount;
      return acc;
    },
    {} as Record<string, number>,
  );

  let currentOffset = 25; // Start at top (25 for SVG dashoffset)
  return Object.entries(categories).map(([label, value], index) => {
    const percent = (value / totalUsed.value) * 100;
    const segment = {
      label,
      percent,
      offset: currentOffset,
      color: colors[index % colors.length],
    };
    currentOffset -= percent;
    return segment;
  });
});

const getProgressColor = (progress: number) => {
  if (progress < 50) return "var(--ion-color-success)";
  if (progress < 80) return "var(--ion-color-warning)";
  return "var(--ion-color-danger)";
};
</script>
