<template>
  <div :class="$style.tableContainer">
    <table :class="$style.table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" :class="$style.th">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data" :key="index" :class="$style.tr">
          <td v-for="column in columns" :key="column.key" :class="$style.td">
            <!-- Allow completely custom slots -->
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              
              <!-- Badge Type -->
              <template v-if="column.type === 'badge'">
                <BaseBadge :color="column.colorMap?.[row[column.key]] || 'medium'">
                  {{ row[column.key] }}
                </BaseBadge>
              </template>

              <!-- Toggle / Switch Type -->
              <template v-else-if="column.type === 'toggle'">
                <BaseSwitch 
                  v-model="row[column.key]" 
                  :disabled="column.disabled" 
                  @update:modelValue="(val) => $emit('update', { row, key: column.key, value: val })"
                />
              </template>

              <!-- Checkbox Type -->
              <template v-else-if="column.type === 'checkbox'">
                <BaseCheckbox 
                  v-model="row[column.key]" 
                  :disabled="column.disabled"
                  @update:modelValue="(val) => $emit('update', { row, key: column.key, value: val })"
                />
              </template>

              <!-- Select Type -->
              <template v-else-if="column.type === 'select'">
                <BaseSelect 
                  v-model="row[column.key]" 
                  :options="column.options || []"
                  :placeholder="column.placeholder"
                  :disabled="column.disabled"
                  @update:modelValue="(val) => $emit('update', { row, key: column.key, value: val })"
                />
              </template>

              <!-- Radio Type -->
              <template v-else-if="column.type === 'radio'">
                <div :class="$style.radioGroup">
                  <BaseRadio 
                    v-for="opt in (column.options || [])" 
                    :key="opt.value"
                    v-model="row[column.key]"
                    :value="opt.value"
                    :label="opt.label"
                    :disabled="column.disabled"
                    @update:modelValue="(val) => $emit('update', { row, key: column.key, value: val })"
                  />
                </div>
              </template>

              <!-- Default Text -->
              <template v-else>
                {{ row[column.key] }}
              </template>

            </slot>
          </td>
        </tr>
        <tr v-if="data.length === 0">
          <td :colspan="columns.length" :class="$style.emptyState">
            {{ emptyMessage || 'No data available' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import BaseBadge from "./BaseBadge.vue";
import BaseSwitch from "./BaseSwitch.vue";
import BaseCheckbox from "./BaseCheckbox.vue";
import BaseSelect from "./BaseSelect.vue";
import BaseRadio from "./BaseRadio.vue";

export type ColumnType = 'text' | 'badge' | 'toggle' | 'checkbox' | 'select' | 'radio' | 'slot';

/** 定義基礎表格欄位的 Key 與顯示名稱，並支援擴展複合類型 */
export interface TableColumn {
  key: string;
  label: string;
  type?: ColumnType;
  /** 給 badge 使用的顏色對映表 */
  colorMap?: Record<string, string>;
  /** 給 select / radio 使用的選項 */
  options?: { label: string; value: any }[];
  /** 預設佔位提示符 */
  placeholder?: string;
  /** 是否禁用編輯 */
  disabled?: boolean;
}

defineProps<{
  columns: TableColumn[];
  data: Record<string, any>[];
  emptyMessage?: string;
}>();

defineEmits<{
  (e: 'update', payload: { row: any; key: string; value: any }): void;
}>();
</script>

<style lang="scss" module src="./BaseTable.module.scss"></style>
