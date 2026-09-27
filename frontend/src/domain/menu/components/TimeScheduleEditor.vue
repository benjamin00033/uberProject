<script setup lang="ts">
import { ref, watch } from "vue";
import $styles from "./TimeScheduleEditor.module.scss";
import { useI18n } from "vue-i18n";
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonList,
  IonAccordionGroup,
  IonAccordion,
} from "@ionic/vue";
import { saveOutline, addOutline, trashOutline } from "ionicons/icons";
import type { Menu, ServiceAvailability } from "../types";
import { menuSchema } from "../schemas/menuTime.schema";

const props = defineProps<{
  initialData?: Partial<Menu>;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  (e: "save", data: Partial<Menu>): void;
}>();

const { t } = useI18n();

const formData = ref<Partial<Menu>>({
  id: "store_hours",
  title: { translations: { en: "Store Hours", zh: "營業時間" } },
  service_availability: [],
  category_ids: [],
});

const errors = ref<Record<string, string>>({});

const daysOfWeek = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      formData.value = JSON.parse(JSON.stringify(newVal));
    } else {
      formData.value = {
        id: "store_hours",
        title: { translations: { en: "Store Hours", zh: "營業時間" } },
        service_availability: [],
        category_ids: [],
      };
    }

    if (!formData.value.title)
      formData.value.title = {
        translations: { en: "Store Hours", zh: "營業時間" },
      };
    if (!formData.value.service_availability)
      formData.value.service_availability = [];

    const availabilityMap = new Map(
      formData.value.service_availability.map((sa) => [sa.day_of_week, sa]),
    );

    formData.value.service_availability = daysOfWeek.map((day) => {
      if (availabilityMap.has(day)) {
        return availabilityMap.get(day)!;
      }
      return { day_of_week: day, time_periods: [] };
    });
  },
  { immediate: true, deep: true },
);

const addTimePeriod = (dayIndex: number) => {
  formData.value.service_availability![dayIndex].time_periods.push({
    start_time: "09:00",
    end_time: "21:00",
  });
};

const removeTimePeriod = (dayIndex: number, periodIndex: number) => {
  formData.value.service_availability![dayIndex].time_periods.splice(
    periodIndex,
    1,
  );
};

const validateAndSave = () => {
  const dataToValidate = JSON.parse(JSON.stringify(formData.value));
  dataToValidate.service_availability =
    dataToValidate.service_availability.filter(
      (sa: ServiceAvailability) => sa.time_periods.length > 0,
    );

  const result = menuSchema.safeParse(dataToValidate);
  if (!result.success) {
    errors.value = {};
    result.error.errors.forEach((err) => {
      const path = err.path.join(".");
      errors.value[path] = err.message;
    });
    return;
  }
  errors.value = {};
  emit("save", dataToValidate);
};
</script>

<template>
  <div :class="$styles.timeScheduleEditor">
    <ion-list>
      <div class="schedule-section">
        <ion-accordion-group :multiple="true">
          <ion-accordion
            v-for="(day, dIndex) in formData.service_availability"
            :key="day.day_of_week"
            :value="day.day_of_week"
          >
            <ion-item slot="header">
              <ion-label
                >{{ t(`menuTime.form.days.${day.day_of_week}`) }} ({{
                  day.time_periods.length
                }}
                段)</ion-label
              >
            </ion-item>
            <div class="ion-padding" slot="content">
              <div
                v-for="(period, pIndex) in day.time_periods"
                :key="pIndex"
                :class="$styles.timePeriodRow"
              >
                <ion-item :class="$styles.timeInput">
                  <ion-input
                    type="time"
                    :label="t('menuTime.form.startTime')"
                    label-placement="floating"
                    v-model="period.start_time"
                  ></ion-input>
                </ion-item>
                <span :class="$styles.toText">-</span>
                <ion-item :class="$styles.timeInput">
                  <ion-input
                    type="time"
                    :label="t('menuTime.form.endTime')"
                    label-placement="floating"
                    v-model="period.end_time"
                  ></ion-input>
                </ion-item>
                <ion-button
                  color="danger"
                  fill="clear"
                  @click="removeTimePeriod(dIndex, pIndex)"
                >
                  <ion-icon :icon="trashOutline" slot="icon-only"></ion-icon>
                </ion-button>
              </div>

              <div
                v-if="errors[`service_availability.${dIndex}.time_periods`]"
                :class="$styles.errorText"
              >
                時間格式錯誤
              </div>

              <ion-button
                fill="outline"
                size="small"
                @click="addTimePeriod(dIndex)"
                :class="$styles.addTimeBtn"
              >
                <ion-icon :icon="addOutline" slot="start"></ion-icon>
                {{ t("menuTime.form.addTimePeriod") }}
              </ion-button>
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </div>
    </ion-list>

    <div :class="[$styles.actionButtons, 'ion-padding']">
      <ion-button
        color="primary"
        @click="validateAndSave"
        :disabled="isSubmitting"
        expand="block"
        shape="round"
      >
        <ion-icon :icon="saveOutline" slot="start"></ion-icon>
        {{ t("menuTime.form.save") }}
      </ion-button>
    </div>
  </div>
</template>
