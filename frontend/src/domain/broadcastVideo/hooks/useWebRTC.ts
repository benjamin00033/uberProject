import { ref, shallowRef } from "vue";
import type { SignalingMessage } from "./useSignaling";
import { useSignaling } from "./useSignaling";

export type CallState =
  | "idle"
  | "joined"
  | "calling"
  | "receiving"
  | "connected";

export function useWebRTC() {
  const signalingService = useSignaling();
  const localStream = shallowRef<MediaStream | null>(null);
  const remoteStream = shallowRef<MediaStream | null>(null);
  const peerConnection = shallowRef<RTCPeerConnection | null>(null);
  const callState = ref<CallState>("idle");
  const currentRoomId = ref<string>("");
  const incomingOffer = shallowRef<RTCSessionDescriptionInit | null>(null);
  const candidateQueue = ref<RTCIceCandidateInit[]>([]);

  const STUN_SERVERS = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  const startLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStream.value = stream;
    } catch (err) {
      console.error("無法取得攝影機/麥克風權限", err);
      throw err;
    }
  };

  const initPeerConnection = () => {
    const pc = new RTCPeerConnection(STUN_SERVERS);
    if (localStream.value) {
      localStream.value.getTracks().forEach((track) => {
        pc.addTrack(track, localStream.value!);
      });
    }

    pc.ontrack = (event) => {
      remoteStream.value = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        signalingService.sendMessage("candidate", event.candidate);
      }
    };

    peerConnection.value = pc;
  };

  const handleSignalingMessage = async (msg: SignalingMessage) => {
    if (msg.type === "offer") {
      incomingOffer.value = msg.payload;
      callState.value = "receiving";
    }

    if (msg.type === "answer" && peerConnection.value) {
      await peerConnection.value.setRemoteDescription(
        new RTCSessionDescription(msg.payload),
      );
      callState.value = "connected";
      processCandidateQueue();
    }

    if (msg.type === "candidate" && peerConnection.value) {
      if (peerConnection.value.remoteDescription) {
        try {
          await peerConnection.value.addIceCandidate(
            new RTCIceCandidate(msg.payload),
          );
        } catch (e) {
          console.error("Error adding ice candidate", e);
        }
      } else {
        candidateQueue.value.push(msg.payload);
      }
    }

    if (msg.type === "hangup") {
      resetConnection();
      callState.value = "joined";
    }
  };

  const processCandidateQueue = () => {
    candidateQueue.value.forEach(async (candidate) => {
      if (peerConnection.value) {
        try {
          await peerConnection.value.addIceCandidate(
            new RTCIceCandidate(candidate),
          );
        } catch (e) {
          console.error("Error adding queued candidate", e);
        }
      }
    });
    candidateQueue.value = [];
  };

  const joinRoom = async (roomId: string) => {
    if (!roomId) return;
    currentRoomId.value = roomId;

    if (!localStream.value) {
      await startLocalMedia();
    }

    signalingService.joinRoom(roomId, handleSignalingMessage);
    initPeerConnection();
    callState.value = "joined";
  };

  const call = async () => {
    if (!peerConnection.value) return;
    callState.value = "calling";
    const offer = await peerConnection.value.createOffer();
    await peerConnection.value.setLocalDescription(offer);
    signalingService.sendMessage("offer", offer);
  };

  const answerCall = async () => {
    if (!peerConnection.value || !incomingOffer.value) return;

    await peerConnection.value.setRemoteDescription(
      new RTCSessionDescription(incomingOffer.value),
    );
    processCandidateQueue();

    const answer = await peerConnection.value.createAnswer();
    await peerConnection.value.setLocalDescription(answer);
    signalingService.sendMessage("answer", answer);
    incomingOffer.value = null;
    callState.value = "connected";
  };

  const resetConnection = () => {
    if (peerConnection.value) {
      peerConnection.value.close();
      peerConnection.value = null;
    }
    remoteStream.value = null;
    incomingOffer.value = null;
    candidateQueue.value = [];
    initPeerConnection();
  };

  const hangup = () => {
    signalingService.sendMessage("hangup");
    resetConnection();
    callState.value = "joined";
  };

  const leaveRoom = () => {
    hangup(); // Send hangup to others before leaving
    if (peerConnection.value) {
      peerConnection.value.close();
      peerConnection.value = null;
    }
    if (localStream.value) {
      localStream.value.getTracks().forEach((t) => t.stop());
      localStream.value = null;
    }
    remoteStream.value = null;
    signalingService.leaveRoom();
    callState.value = "idle";
    currentRoomId.value = "";
  };

  return {
    localStream,
    remoteStream,
    callState,
    currentRoomId,
    joinRoom,
    call,
    answerCall,
    hangup,
    leaveRoom,
  };
}
