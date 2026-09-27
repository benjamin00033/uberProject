import { onMounted, onUnmounted, ref } from "vue";

export function usetimer() {
  const initial = ref(1);
  let timerId: any;

  const startTimer = function () {
    if (timerId != null) return;
    const addTime = () => {
      initial.value++;
    };
    timerId = setInterval(() => {
      addTime();
    }, 1000);
  };

  const stopTimer = () => {
    if (timerId != null) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  //  需要渲染時間軸所需要建立的原因
  onMounted(() => {
    startTimer();
  });

  onUnmounted(() => {
    stopTimer();
  });

  return {
    initial,
    startTimer,
  };
}
