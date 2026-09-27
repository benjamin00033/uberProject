<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from "@ionic/vue";
import { arrowBackOutline, desktopOutline } from "ionicons/icons";
import { useRouter } from "vue-router";
import TestScenarioCard from "../components/TestScenarioCard.vue";

import CenterLayout from "@/components/Layout/CenterLayout.vue";
import SingleColumnLayout from "@/components/Layout/SingleColumnLayout.vue";
import TwoColumnLayout from "@/components/Layout/TwoColumnLayout.vue";
import ThreeColumnLayout from "@/components/Layout/ThreeColumnLayout.vue";
import FourColumnLayout from "@/components/Layout/FourColumnLayout.vue";
import MasterDetailLayout from "@/components/Layout/MasterDetailLayout.vue";
import DashboardBentoLayout from "@/components/Layout/DashboardBentoLayout.vue";

const router = useRouter();

const mockData = {
  header: "Layout Header 區塊",
  content: "這是主要內容區塊 (Main Content)",
  left: "左側邊欄 (Left Sidebar)",
  right: "右側邊欄 (Right Sidebar)",
  col1: "欄位 1 (Col 1)",
  col2: "欄位 2 (Col 2)",
  col3: "欄位 3 (Col 3)",
  col4: "欄位 4 (Col 4)"
};
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-button slot="start" fill="clear" @click="router.back()">
          <ion-icon :icon="arrowBackOutline" />
        </ion-button>
        <ion-title>
          <ion-icon :icon="desktopOutline" class="title-icon"></ion-icon>
          排版展示 (Layouts Showcase)
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <p class="intro-text">
        下方列出了系統中所有可用的基礎排版元件。這些元件皆支援 RWD 響應式佈局。
        我們透過 <code>TestScenarioCard</code> 將每一個版型區隔開來，讓您可以直接往下滑動比較差異。
      </p>

      <!-- 1. Center Layout -->
      <TestScenarioCard title="置中對齊 (Center Layout)" description="用於登入、提示頁面，將內容完美置中於畫面。">
        <div class="layout-preview-box">
          <CenterLayout>
            <div class="demo-box demo-main">
              <h3>{{ mockData.content }}</h3>
              <p class="demo-text">我會被置中顯示</p>
            </div>
          </CenterLayout>
        </div>
      </TestScenarioCard>

      <!-- 2. Single Column Layout -->
      <TestScenarioCard title="單欄佈局 (Single Column Layout)" description="最常見的單一內容區，適合文章閱讀或標準表單。">
        <div class="layout-preview-box">
          <SingleColumnLayout>
            <div class="demo-box demo-main">
              <h3>{{ mockData.content }}</h3>
            </div>
          </SingleColumnLayout>
        </div>
      </TestScenarioCard>

      <!-- 3. Two Column Layout -->
      <TestScenarioCard title="雙欄佈局 (Two Column Layout)" description="常見於具有左側選單、過濾器，右側為主內容的頁面。">
        <div class="layout-preview-box">
          <TwoColumnLayout>
            <template #left>
              <div class="demo-box demo-left">
                <h3>{{ mockData.left }}</h3>
              </div>
            </template>
            <template #default>
              <div class="demo-box demo-main">
                <h3>{{ mockData.content }}</h3>
              </div>
            </template>
          </TwoColumnLayout>
        </div>
      </TestScenarioCard>

      <!-- 4. Three Column Layout -->
      <TestScenarioCard title="三欄佈局 (Three Column Layout)" description="適合複雜的資訊頁面，左側選單、中間內容、右側輔助資訊。">
        <div class="layout-preview-box">
          <ThreeColumnLayout>
            <template #left>
              <div class="demo-box demo-left">
                <h3>{{ mockData.left }}</h3>
              </div>
            </template>
            <template #default>
              <div class="demo-box demo-main">
                <h3>{{ mockData.content }}</h3>
              </div>
            </template>
            <template #right>
              <div class="demo-box demo-right">
                <h3>{{ mockData.right }}</h3>
              </div>
            </template>
          </ThreeColumnLayout>
        </div>
      </TestScenarioCard>

      <!-- 5. Four Column Layout -->
      <TestScenarioCard title="四欄儀表板 (Four Column Layout)" description="適合數據統計 Dashboard，等寬切分為四塊。">
        <div class="layout-preview-box">
          <FourColumnLayout>
            <template #col1>
              <div class="demo-box demo-col1">
                <h3>{{ mockData.col1 }}</h3>
              </div>
            </template>
            <template #col2>
              <div class="demo-box demo-col2">
                <h3>{{ mockData.col2 }}</h3>
              </div>
            </template>
            <template #col3>
              <div class="demo-box demo-col3">
                <h3>{{ mockData.col3 }}</h3>
              </div>
            </template>
            <template #col4>
              <div class="demo-box demo-col4">
                <h3>{{ mockData.col4 }}</h3>
              </div>
            </template>
          </FourColumnLayout>
        </div>
      </TestScenarioCard>

      <!-- 6. Master-Detail Layout -->
      <TestScenarioCard title="主從明細佈局 (Master-Detail Layout)" description="ERP 最常見的排版，左側為列表，右側為明細內容。">
        <div class="layout-preview-box">
          <MasterDetailLayout>
            <template #list>
              <div class="demo-box demo-left">
                <h3>List</h3>
                <p class="demo-text">(例如：訂單列表)</p>
              </div>
            </template>
            <template #detail>
              <div class="demo-box demo-main">
                <h3>Detail</h3>
                <p class="demo-text">(例如：訂單詳細資訊)</p>
              </div>
            </template>
          </MasterDetailLayout>
        </div>
      </TestScenarioCard>

      <!-- 7. Dashboard Bento Layout -->
      <TestScenarioCard title="儀表板便當盒佈局 (Dashboard Bento Grid)" description="基於 CSS Grid 的現代化儀表板，支援不同大小的卡片 (Hero, Wide, Tall, Standard)。">
        <div class="layout-preview-box">
          <DashboardBentoLayout>
            <!-- 最大塊的 Hero (跨 2x2) -->
            <template #hero>
              <div class="demo-box demo-main rounded-box">
                <h3>Hero (2x2)</h3>
              </div>
            </template>
            
            <!-- 寬幅塊 (跨 2x1) -->
            <template #wide>
              <div class="demo-box demo-tertiary rounded-box">
                <h3>Wide (2x1)</h3>
              </div>
            </template>
            
            <!-- 高幅塊 (跨 1x2) -->
            <template #tall>
              <div class="demo-box demo-success rounded-box">
                <h3>Tall (1x2)</h3>
              </div>
            </template>
            
            <!-- 標準大小 (1x1)，可放多個 -->
            <template #default>
              <div class="demo-box demo-secondary rounded-box">
                <h3>Card 1</h3>
              </div>
              <div class="demo-box demo-warning rounded-box">
                <h3>Card 2</h3>
              </div>
            </template>
          </DashboardBentoLayout>
        </div>
      </TestScenarioCard>

    </ion-content>
  </ion-page>
</template>

<style scoped>
.layout-preview-box {
  /* 
    關鍵點：因為 Layout 內部都用了 <ion-page>，預設是 absolute 鋪滿整個 Viewport。
    給予 relative 和 overflow hidden 可以將 <ion-page> 限制在這個框框內，達到完美預覽效果。
  */
  position: relative;
  width: 100%;
  height: 400px;
  border: 1px solid var(--ion-color-step-150, #d7d8da);
  border-radius: 8px;
  overflow: hidden;
  background: var(--ion-color-step-50, #f4f5f8);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.layout-preview-box :deep(ion-page) {
  position: absolute;
  contain: strict;
  height: 100%;
}

.demo-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  padding: 16px;
  border-radius: 8px;
  color: #fff;
  text-align: center;
  box-shadow: inset 0 0 0 2px rgba(255,255,255,0.2);
}

.demo-box h3 {
  margin: 0;
  font-weight: 600;
  color: #fff;
  font-size: 1.2rem;
}

/* 用不同顏色來區分區塊 */
.demo-main {
  background: var(--ion-color-primary);
}
.demo-left {
  background: var(--ion-color-secondary);
}
.demo-right {
  background: var(--ion-color-tertiary);
}
.demo-col1 {
  background: var(--ion-color-primary);
}
.demo-col2 {
  background: var(--ion-color-secondary);
}
.demo-col3 {
  background: var(--ion-color-tertiary);
}
.demo-col4 {
  background: var(--ion-color-success);
}

.title-icon {
  vertical-align: middle;
  margin-right: 8px;
}
.intro-text {
  color: var(--ion-color-medium);
  margin-bottom: 24px;
}
.demo-text {
  margin-top: 8px;
}
.rounded-box {
  border-radius: 8px;
}
.demo-tertiary { background: var(--ion-color-tertiary); }
.demo-success { background: var(--ion-color-success); }
.demo-secondary { background: var(--ion-color-secondary); }
.demo-warning { background: var(--ion-color-warning); }
</style>
