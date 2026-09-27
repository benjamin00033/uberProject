import { useWebSocketStore } from "@/stores/websocket.store";
import { wsService } from "@/services/websocket.service";

export interface SignalingMessage {
  roomId: string;
  senderId: string;
  type: "offer" | "answer" | "candidate" | "hangup";
  payload?: any;
}

export function useSignaling() {
  const websocketStore = useWebSocketStore();
  let currentRoomId: string | null = null;
  let messageCallback: ((msg: SignalingMessage) => void) | null = null;
  const localSenderId = Math.random().toString(36).substring(2, 9); // Random ID for this client

  const joinRoom = (
    roomId: string,
    onMessage: (msg: SignalingMessage) => void,
  ) => {
    currentRoomId = roomId;
    messageCallback = onMessage;
    // 註冊 Pinia WebSocket callback
    websocketStore.registerCallback(
      "webrtc-signaling",
      `webrtc-${roomId}`,
      (data: SignalingMessage) => {
        // 過濾：只處理自己房間的訊息，且不處理自己送出的訊息（防止 echo）
        if (
          data.roomId === currentRoomId &&
          data.senderId !== localSenderId &&
          messageCallback
        ) {
          messageCallback(data);
        }
      },
    );
  };

  const sendMessage = (type: SignalingMessage["type"], payload?: any) => {
    if (!currentRoomId) return;

    const message: SignalingMessage = {
      roomId: currentRoomId,
      senderId: localSenderId,
      type,
      payload,
    };

    wsService.emit("webrtc-signaling", message);
  };

  const leaveRoom = () => {
    if (currentRoomId) {
      websocketStore.unregisterCallback(
        "webrtc-signaling",
        `webrtc-${currentRoomId}`,
      );
      currentRoomId = null;
      messageCallback = null;
    }
  };

  return {
    localSenderId,
    joinRoom,
    sendMessage,
    leaveRoom,
  };
}
