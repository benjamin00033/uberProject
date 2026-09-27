<template>
  <SingleColumnLayout>
    <template #header>
      <ion-header>
      <ion-toolbar>
        <ion-title>視訊電話</ion-title>
      </ion-toolbar>
          </ion-header>
    </template>
    
      <div :class="$styles.videoLayout">
        <!-- 視訊畫面區塊 (背景/主要區域) -->
        <div :class="$styles.videoArea" v-show="callState !== 'idle'">
          <div :class="$styles.remoteVideoWrapper">
            <video ref="remoteVideoRef" autoplay playsinline></video>
            <div :class="$styles.videoLabel">對方畫面</div>
          </div>

          <!-- 浮動的 Local 視訊 -->
          <div :class="$styles.localVideoWrapper" v-show="showLocalVideo">
            <video ref="localVideoRef" autoplay muted playsinline></video>
            <div :class="$styles.videoLabel">我的畫面</div>
          </div>
        </div>

        <div :class="$styles.emptyArea" v-if="callState === 'idle'">
          <!-- 空白區域，讓卡片沉底 -->
        </div>

        <!-- 底部控制區塊 -->
        <div :class="$styles.bottomControls">
          <!-- Local 視訊切換按鈕 -->
          <div :class="$styles.floatingActions" v-if="callState !== 'idle'">
            <ion-button
              color="light"
              size="small"
              shape="round"
              fill="solid"
              @click="showLocalVideo = !showLocalVideo"
            >
              {{ showLocalVideo ? "隱藏個人畫面" : "顯示個人畫面" }}
            </ion-button>
          </div>

          <!-- Room 設定區塊 (較為精簡的設計) -->
          <div v-if="callState === 'idle'" :class="$styles.sleekPanel">
            <div :class="$styles.panelTitle">加入通話房間</div>
            <div :class="$styles.joinRow">
              <ion-input
                v-model="roomIdInput"
                placeholder="輸入房號 (例: room-123)"
                :class="$styles.sleekInput"
              />
              <ion-button
                @click="handleJoin"
                shape="round"
                :class="$styles.joinBtn"
                >加入</ion-button
              >
            </div>
          </div>

          <!-- 通話控制區塊 (精簡圓角設計) -->
          <div v-else :class="$styles.callControlsPanel">
            <div :class="$styles.statusBadge">
              <span>房間: {{ currentRoomId }}</span>
              <span :class="$styles.divider">|</span>
              <span :class="$styles.stateText">{{ callState }}</span>
            </div>
            <div :class="$styles.sleekActions">
              <ion-button
                v-if="callState === 'joined'"
                color="success"
                shape="round"
                @click="call"
                >撥打 (Call)</ion-button
              >

              <ion-button
                v-if="callState === 'receiving'"
                color="success"
                shape="round"
                @click="answerCall"
                >接聽 (Answer)</ion-button
              >

              <ion-button
                v-if="['calling', 'receiving', 'connected'].includes(callState)"
                color="danger"
                shape="round"
                @click="hangup"
                >掛斷 (Hangup)</ion-button
              >

              <ion-button
                color="medium"
                shape="round"
                fill="outline"
                class="leave-btn"
                @click="leaveRoom"
                >離開房間</ion-button
              >
            </div>
          </div>
        </div>
      </div>
    
  </SingleColumnLayout>
</template>

<script setup lang="ts">
import SingleColumnLayout from "@/components/Layout/SingleColumnLayout.vue";
import $styles from "./BroadcastVideo.module.scss";
import { ref, watch, onBeforeUnmount, onMounted } from "vue";
import { wsService } from "@/services/websocket.service";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
} from "@ionic/vue";
import { useWebRTC } from "../hooks/useWebRTC";

const roomIdInput = ref("");
const localVideoRef = ref<HTMLVideoElement | null>(null);
const remoteVideoRef = ref<HTMLVideoElement | null>(null);

// 控制本地畫面顯示與否 (預設隱藏)
const showLocalVideo = ref(false);

const {
  localStream,
  remoteStream,
  callState,
  currentRoomId,
  joinRoom,
  call,
  answerCall,
  hangup,
  leaveRoom,
} = useWebRTC();

const handleJoin = () => {
  if (roomIdInput.value.trim()) {
    joinRoom(roomIdInput.value.trim());
  }
};

watch(localStream, (stream) => {
  if (localVideoRef.value && stream) {
    localVideoRef.value.srcObject = stream;
  }
});

watch(remoteStream, (stream) => {
  if (remoteVideoRef.value && stream) {
    remoteVideoRef.value.srcObject = stream;
  }
});

onBeforeUnmount(() => {
  leaveRoom();
});

// 僅需要再websocket domain 時連線內容
// 設定webssocket 的連線位址
onMounted(() => {
  // 1. 設定後端的 WebSocket Server 網址
  // (您可以改從 import.meta.env 讀取環境變數)
  wsService.setEndpoint("https://unstable-extent-surfer.ngrok-free.dev");
  // 2. 開始連線
  wsService.connect();
});
</script>
