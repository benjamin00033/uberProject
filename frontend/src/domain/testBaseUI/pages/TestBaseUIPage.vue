<script setup lang="ts">
import SingleColumnLayout from "@/components/Layout/SingleColumnLayout.vue";
import { ref, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonText,
} from "@ionic/vue";
import {
  colorPaletteOutline,
  addOutline,
  trashOutline,
  saveOutline,
  notificationsOutline,
} from "ionicons/icons";
import $styles from "./TestBaseUIPage.module.scss";

// Domain specific testing wrapper
import TestScenarioCard from "../components/TestScenarioCard.vue";

// Global Shared Components
import BaseInput from "@/components/UI/BaseInput.vue";
import BaseTextarea from "@/components/UI/BaseTextarea.vue";
import BaseTable from "@/components/UI/BaseTable.vue";
import BaseCarousel from "@/components/UI/BaseCarousel.vue";
import BasePagination from "@/components/UI/BasePagination.vue";
import BaseSelect from "@/components/UI/BaseSelect.vue";
import BaseSwitch from "@/components/UI/BaseSwitch.vue";
import BaseModal from "@/components/UI/BaseModal.vue";
import BaseSkeleton from "@/components/UI/BaseSkeleton.vue";
import BaseTooltip from "@/components/UI/BaseTooltip.vue";
import BaseNotification, {
  type NotificationItem,
} from "@/components/UI/BaseNotification.vue";
import BaseCheckbox from "@/components/UI/BaseCheckbox.vue";
import BaseRadio from "@/components/UI/BaseRadio.vue";
import BaseDatePicker from "@/components/UI/BaseDatePicker.vue";
import BaseSlider from "@/components/UI/BaseSlider.vue";
import BaseTabs from "@/components/UI/BaseTabs/BaseTabs.vue";
import BaseAccordion from "@/components/UI/BaseAccordion/BaseAccordion.vue";
import BaseDrawer from "@/components/UI/BaseDrawer/BaseDrawer.vue";
import BaseBreadcrumb from "@/components/UI/BaseBreadcrumb/BaseBreadcrumb.vue";
import BaseBadge from "@/components/UI/BaseBadge.vue";
import BaseAvatar from "@/components/UI/BaseAvatar.vue";
import BaseEmptyState from "@/components/UI/BaseEmptyState.vue";

const { t } = useI18n();

const colors = [
  "primary",
  "secondary",
  "tertiary",
  "success",
  "warning",
  "danger",
  "light",
  "medium",
  "dark",
];
const currentTheme = shallowRef("light");

const toggleTheme = () => {
  if (currentTheme.value === "light") {
    currentTheme.value = "dark";
  } else if (currentTheme.value === "dark") {
    currentTheme.value = "cyberpunk";
  } else {
    currentTheme.value = "light";
  }
  document.documentElement.setAttribute("data-theme", currentTheme.value);
};

// Form testing states
const testInput = ref("");
const testTextarea = ref("");

// New form & overlay states
const testSelect = ref<string | null>(null);
const testSwitch = ref(false);
const selectOptions = [
  { label: t("testBaseUI.page.selectAdmin"), value: "admin" },
  { label: t("testBaseUI.page.selectUser"), value: "user" },
  { label: t("testBaseUI.page.selectGuest"), value: "guest" },
];
const isModalOpen = ref(false);
const testCheckbox = ref(false);
const testRadio = ref("");
const testDate = ref("");
const testSlider = ref(50);
const isDrawerOpen = ref(false);

// Notification testing state
const notifications = ref<NotificationItem[]>([]);
let notifId = 0;
const showTestNotification = () => {
  notifications.value.push({
    id: String(++notifId),
    title: t("testBaseUI.page.scenarioNotificationTitle"),
    message: t("testBaseUI.page.notificationMessage"),
    type: "success",
  });
  // Auto remove after 3s
  setTimeout(() => {
    removeNotification(String(notifId));
  }, 3000);
};
const removeNotification = (id: string) => {
  notifications.value = notifications.value.filter((n) => n.id !== id);
};

// Table testing data
import type { TableColumn } from "@/components/UI/BaseTable.vue";

const compositeTableColumns: TableColumn[] = [
  { key: "id", label: "ID", type: "text" },
  { key: "name", label: "Name", type: "text" },
  { 
    key: "role", 
    label: "Role", 
    type: "select", 
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
      { label: "Editor", value: "editor" }
    ] 
  },
  { 
    key: "status", 
    label: "Status", 
    type: "badge",
    colorMap: { "active": "success", "inactive": "danger", "pending": "warning" } 
  },
  { key: "isActive", label: "Active", type: "toggle" }
];

const compositeTableData = ref([
  { id: 1, name: "Alice", role: "admin", status: "active", isActive: true },
  { id: 2, name: "Bob", role: "user", status: "inactive", isActive: false },
  { id: 3, name: "Charlie", role: "editor", status: "pending", isActive: true },
]);

// Pagination testing data
const currentPage = ref(1);
</script>

<template>
  <SingleColumnLayout>
    <template #header>
      <ion-header>
      <ion-toolbar>
        <ion-title>
          <ion-icon :icon="colorPaletteOutline" class="title-icon"></ion-icon>
          {{ t("routes.TestBaseUI.title", "UI Test Ground") }}
        </ion-title>
      </ion-toolbar>
          </ion-header>
    </template>
    
      <div class="ion-margin-bottom">
        <ion-card>
          <ion-card-content>
            <p class="card-text">{{ t("testBaseUI.page.description") }}</p>
            <ion-button @click="toggleTheme">
              {{ t("testBaseUI.page.toggleTheme", { theme: currentTheme }) }}
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>

      <ion-grid>
        <ion-row>
          <ion-col size="12">
            <TestScenarioCard
              :title="t('testBaseUI.page.scenarioInputTitle')"
              :description="t('testBaseUI.page.scenarioInputDesc')"
            >
              <BaseInput
                v-model="testInput"
                :label="t('testBaseUI.page.inputUsernameLabel')"
                :placeholder="t('testBaseUI.page.inputUsernamePlaceholder')"
                clear-input
              />
              <p>{{ t("testBaseUI.page.typed", { text: testInput }) }}</p>

              <BaseTextarea
                v-model="testTextarea"
                :label="t('testBaseUI.page.inputTextareaLabel')"
                :placeholder="t('testBaseUI.page.inputTextareaPlaceholder')"
                :rows="3"
              />
              <p>{{ t("testBaseUI.page.typed", { text: testTextarea }) }}</p>

              <BaseInput
                v-model="testInput"
                :label="t('testBaseUI.page.inputErrorLabel')"
                :placeholder="t('testBaseUI.page.inputErrorPlaceholder')"
                :error="t('testBaseUI.page.inputErrorMessage')"
              />
            </TestScenarioCard>

            <TestScenarioCard
              :title="t('testBaseUI.page.scenarioTableTitle', 'JSON 驅動複合表格')"
              :description="t('testBaseUI.page.scenarioTableDesc', '支援透過 JSON 設定直接渲染 Badge, Toggle, Select 等多種元件的資料表格。')"
            >
              <BaseTable 
                :columns="compositeTableColumns" 
                :data="compositeTableData" 
                @update="console.log('Table updated:', $event)"
              >
              </BaseTable>
              <div class="ion-margin-top">
                <p><strong>目前的資料狀態：</strong></p>
                <pre :class="$styles.preBlock">{{ compositeTableData }}</pre>
              </div>
            </TestScenarioCard>

            <TestScenarioCard
              :title="t('testBaseUI.page.scenarioPaginationTitle')"
              :description="t('testBaseUI.page.scenarioPaginationDesc')"
            >
              <BasePagination
                v-model:currentPage="currentPage"
                :total-items="100"
                :page-size="10"
              />
              <p :class="$styles.centerText">
                {{
                  t("testBaseUI.page.paginationViewing", {
                    current: currentPage,
                  })
                }}
              </p>
            </TestScenarioCard>

            <TestScenarioCard
              :title="t('testBaseUI.page.scenarioCarouselTitle')"
              :description="t('testBaseUI.page.scenarioCarouselDesc')"
            >
              <BaseCarousel>
                <div v-for="i in 5" :key="i" :class="$styles.carouselCard">
                  {{ t("testBaseUI.page.carouselCard", { index: i }) }}
                </div>
              </BaseCarousel>
            </TestScenarioCard>

            <!-- New Form Components Section -->
            <TestScenarioCard
              :title="t('testBaseUI.page.scenarioSelectTitle')"
              :description="t('testBaseUI.page.scenarioSelectDesc')"
            >
              <BaseSelect
                v-model="testSelect"
                :label="t('testBaseUI.page.selectLabel')"
                :placeholder="t('testBaseUI.page.selectPlaceholder')"
                :options="selectOptions"
              />
              <p>
                {{ t("testBaseUI.page.typed", { text: testSelect || "none" }) }}
              </p>
            </TestScenarioCard>

            <TestScenarioCard
              :title="t('testBaseUI.page.scenarioSwitchTitle')"
              :description="t('testBaseUI.page.scenarioSwitchDesc')"
            >
              <BaseSwitch
                v-model="testSwitch"
                :label="t('testBaseUI.page.switchLabel')"
              />
              <p>Status: {{ testSwitch }}</p>
            </TestScenarioCard>

            <TestScenarioCard
              :title="t('testBaseUI.page.scenarioModalTitle')"
              :description="t('testBaseUI.page.scenarioModalDesc')"
            >
              <ion-button @click="isModalOpen = true">
                {{ t("testBaseUI.page.modalOpenBtn") }}
              </ion-button>

              <BaseModal
                v-model:is-open="isModalOpen"
                :title="t('testBaseUI.page.modalTitle')"
              >
                <p>{{ t("testBaseUI.page.modalContent") }}</p>
                <template #footer>
                  <ion-button expand="block" @click="isModalOpen = false">
                    {{ t("testBaseUI.page.modalCloseBtn") }}
                  </ion-button>
                </template>
              </BaseModal>
            </TestScenarioCard>

            <TestScenarioCard
              :title="t('testBaseUI.page.scenarioSkeletonTitle')"
              :description="t('testBaseUI.page.scenarioSkeletonDesc')"
            >
              <div :class="$styles.skeletonRow">
                <BaseSkeleton variant="circular" width="48px" height="48px" />
                <div :class="$styles.flex1">
                  <BaseSkeleton variant="text" width="60%" />
                  <BaseSkeleton variant="text" width="40%" />
                </div>
              </div>
              <BaseSkeleton variant="rectangular" height="150px" />
            </TestScenarioCard>

            <TestScenarioCard
              :title="t('testBaseUI.page.scenarioTooltipTitle')"
              :description="t('testBaseUI.page.scenarioTooltipDesc')"
            >
              <div :class="$styles.tooltipRow">
                <BaseTooltip
                  :text="t('testBaseUI.page.tooltipText')"
                  position="top"
                >
                  <ion-button fill="outline"
                    >{{ t("testBaseUI.page.tooltipHoverMe") }} (Top)</ion-button
                  >
                </BaseTooltip>

                <BaseTooltip
                  :text="t('testBaseUI.page.tooltipText')"
                  position="bottom"
                >
                  <ion-button fill="outline"
                    >{{
                      t("testBaseUI.page.tooltipHoverMe")
                    }}
                    (Bottom)</ion-button
                  >
                </BaseTooltip>
              </div>
            </TestScenarioCard>

            <TestScenarioCard
              :title="t('testBaseUI.page.scenarioNotificationTitle')"
              :description="t('testBaseUI.page.scenarioNotificationDesc')"
            >
              <ion-button @click="showTestNotification">
                {{ t("testBaseUI.page.notificationShowBtn") }}
              </ion-button>

              <!-- Floating Notification Component -->
              <BaseNotification
                :notifications="notifications"
                @remove="removeNotification"
              />
            </TestScenarioCard>

            <TestScenarioCard
              :title="t('testBaseUI.page.scenarioFormControlsTitle')"
              :description="t('testBaseUI.page.scenarioFormControlsDesc')"
            >
              <BaseCheckbox
                v-model="testCheckbox"
                :label="t('testBaseUI.page.checkboxLabel')"
              />
              <p>{{ t("testBaseUI.page.checkboxStatus", { status: testCheckbox }) }}</p>

              <div :class="['ion-margin-top', 'ion-margin-bottom', $styles.verticalRadioGroup]">
                <BaseRadio v-model="testRadio" :label="t('testBaseUI.page.radioOptionA')" value="A" />
                <BaseRadio v-model="testRadio" :label="t('testBaseUI.page.radioOptionB')" value="B" />
              </div>
              <p>{{ t("testBaseUI.page.radioStatus", { status: testRadio }) }}</p>

              <BaseDatePicker v-model="testDate" :label="t('testBaseUI.page.datePickerLabel')" />
              <p>{{ t("testBaseUI.page.dateStatus", { status: testDate || 'none' }) }}</p>

              <BaseSlider
                v-model="testSlider"
                :label="t('testBaseUI.page.sliderLabel')"
                :min="0"
                :max="100"
              />
              <p>{{ t("testBaseUI.page.sliderStatus", { status: testSlider }) }}</p>
            </TestScenarioCard>
            <TestScenarioCard
              :title="t('testBaseUI.page.scenarioLayoutTitle')"
              :description="t('testBaseUI.page.scenarioLayoutDesc')"
            >
              <BaseBreadcrumb
                :items="[
                  { label: t('testBaseUI.page.breadcrumbHome'), href: '#' },
                  { label: t('testBaseUI.page.breadcrumbLibrary'), href: '#' },
                  { label: t('testBaseUI.page.breadcrumbData'), href: '#' },
                ]"
              />

              <div class="ion-margin-top ion-margin-bottom">
                <BaseTabs
                  :tabs="[
                    { label: t('testBaseUI.page.tab1'), value: 'tab1' },
                    { label: t('testBaseUI.page.tab2'), value: 'tab2' },
                  ]"
                  :model-value="'tab1'"
                />
              </div>

              <BaseAccordion :title="t('testBaseUI.page.accordionTitle')">
                <p class="ion-padding">
                  {{ t("testBaseUI.page.accordionContent") }}
                </p>
              </BaseAccordion>

              <div class="ion-margin-top">
                <ion-button @click="isDrawerOpen = true">
                  {{ t("testBaseUI.page.drawerOpenBtn") }}
                </ion-button>
                <BaseDrawer v-model="isDrawerOpen" :title="t('testBaseUI.page.drawerTitle')">
                  <p class="ion-padding">{{ t("testBaseUI.page.drawerContent") }}</p>
                </BaseDrawer>
              </div>
            </TestScenarioCard>

            <TestScenarioCard
              :title="t('testBaseUI.page.scenarioDataPresentationTitle')"
              :description="t('testBaseUI.page.scenarioDataPresentationDesc')"
            >
              <div :class="$styles.avatarRow">
                <BaseAvatar
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                  alt="Avatar"
                />
                <BaseAvatar alt="User initials" text="AB" />
              </div>

              <div :class="$styles.avatarRow">
                <BaseBadge color="primary">{{ t("testBaseUI.page.badgePrimary") }}</BaseBadge>
                <BaseBadge color="success">{{ t("testBaseUI.page.badgeActive") }}</BaseBadge>
                <BaseBadge color="danger">{{ t("testBaseUI.page.badgeFailed") }}</BaseBadge>
              </div>

              <BaseEmptyState
                icon="cube-outline"
                :title="t('testBaseUI.page.emptyStateTitle')"
                :description="t('testBaseUI.page.emptyStateDesc')"
                :actionLabel="t('testBaseUI.page.emptyStateAction')"
              />
            </TestScenarioCard>
            <!-- Buttons Section -->
            <TestScenarioCard :title="t('testBaseUI.page.buttonsTitle')">
              <div :class="$styles.buttonGroup">
                <ion-button v-for="color in colors" :key="color" :color="color">
                  {{ color }}
                </ion-button>
              </div>
              <div :class="[$styles.buttonGroup, 'ion-margin-top']">
                <ion-button fill="outline">{{
                  t("testBaseUI.page.buttonOutline")
                }}</ion-button>
                <ion-button fill="clear">{{
                  t("testBaseUI.page.buttonClear")
                }}</ion-button>
                <ion-button shape="round">{{
                  t("testBaseUI.page.buttonRound")
                }}</ion-button>
                <ion-button size="small">{{
                  t("testBaseUI.page.buttonSmall")
                }}</ion-button>
                <ion-button size="large">{{
                  t("testBaseUI.page.buttonLarge")
                }}</ion-button>
              </div>
            </TestScenarioCard>

            <!-- Icons Section -->
            <TestScenarioCard :title="t('testBaseUI.page.iconButtonsTitle')">
              <div :class="$styles.buttonGroup">
                <ion-button>
                  <ion-icon slot="start" :icon="addOutline"></ion-icon>
                  {{ t("testBaseUI.page.add") }}
                </ion-button>
                <ion-button color="danger">
                  <ion-icon slot="end" :icon="trashOutline"></ion-icon>
                  {{ t("testBaseUI.page.delete") }}
                </ion-button>
                <ion-button color="success">
                  <ion-icon slot="icon-only" :icon="saveOutline"></ion-icon>
                </ion-button>
                <ion-button color="warning" fill="outline">
                  <ion-icon
                    slot="start"
                    :icon="notificationsOutline"
                  ></ion-icon>
                  {{ t("testBaseUI.page.warning") }}
                </ion-button>
              </div>
            </TestScenarioCard>

            <!-- Typography Section -->
            <TestScenarioCard :title="t('testBaseUI.page.typographyTitle')">
              <h1>{{ t("testBaseUI.page.heading1") }}</h1>
              <h2>{{ t("testBaseUI.page.heading2") }}</h2>
              <h3>{{ t("testBaseUI.page.heading3") }}</h3>
              <p>{{ t("testBaseUI.page.paragraph") }}</p>
              <ion-text color="primary">
                <p>{{ t("testBaseUI.page.primaryText") }}</p>
              </ion-text>
              <ion-text color="danger">
                <p>{{ t("testBaseUI.page.dangerText") }}</p>
              </ion-text>
            </TestScenarioCard>
          </ion-col>
        </ion-row>
      </ion-grid>
    
  </SingleColumnLayout>
</template>
