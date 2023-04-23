<template>
  <div class="Dial-wrapper">
    <slot></slot>
    <p class="Dial-label">{{ currentRoundDisplay }}</p>
    <svg
      version="1.2"
      baseProfile="tiny"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 230 230"
      xml:space="preserve"
      width="220"
      height="220"
      class="Dial-fill"
      :class="dialClass"
    >
      <path
        fill="none"
        stroke-width="10"
        stroke-linecap="round"
        stroke-miterlimit="10"
        d="M115,5c60.8,0,110,49.2,110,110s-49.2,110-110,110S5,175.8,5,115S54.2,5,115,5"
      />
    </svg>
    <svg
      version="1.2"
      baseProfile="tiny"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 230 230"
      xml:space="preserve"
      width="220"
      height="220"
      class="Dial-bg"
    >
      <path
        fill="none"
        stroke-width="2"
        stroke-linecap="round"
        stroke-miterlimit="10"
        d="M115,5c60.8,0,110,49.2,110,110s-49.2,110-110,110S5,175.8,5,115S54.2,5,115,5"
      />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { useTimerStore } from "@/store";
import { storeToRefs } from "pinia";
import anime from "animejs";
const {
  currentRound,
  timeLongBreak: longBreak,
  timeShortBreak: shortBreak,
  timeWork: tWork,
} = storeToRefs(useTimerStore());
interface DialProps {
  currentTime: number;
  minutes: number;
  timerActive: boolean;
}
const props = defineProps<DialProps>();

const timeLongBreak = computed(() => {
  return longBreak.value * 60 * 1000;
});

const timeShortBreak = computed(() => {
  return shortBreak.value * 60 * 1000;
});

const timeWork = computed(() => {
  return tWork.value * 60 * 1000;
});

const currentRoundDisplay = computed(() => {
  if (currentRound.value === "work") {
    return "Focus";
  } else if (currentRound.value === "short-break") {
    return "Short Break";
  } else if (currentRound.value === "long-break") {
    return "Long Break";
  }
});

const dialClass = computed(() => {
  if (currentRound.value === "work") {
    return "Dial-fill--work";
  } else if (currentRound.value === "short-break") {
    return "Dial-fill--shortBreak";
  } else if (currentRound.value === "long-break") {
    return "Dial-fill--longBreak";
  }
});

let dial: anime.AnimeInstance | null;
function dialAnimation(duration: number) {
  if (dial !== null) {
    dial = null;
    anime.remove(".Dial-fill path");
    dialAnimation(duration);
  }
  dial = anime({
    targets: ".Dial-fill path",
    strokeDashoffset: [anime.setDashoffset, 0],
    easing(el: HTMLElement, index: number, length: number) {
      return (t: number) => Number(t.toFixed(3));
    },
    duration: duration,
    direction: "reverse",
    autoplay: false,
  });
  dial.seek(dial.duration);
}

function handleFocus() {
  if (props.timerActive && dial) {
    const duration = dial.duration;
    const position = dial.duration - props.currentTime * 1000;
    dial.pause();
    dialAnimation(duration);
    dial.seek(position);
    dial.play();
  }
}
</script>
<style lang="scss" scoped>
.Dial-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 35px;
  position: relative;
}

.Dial-label {
  letter-spacing: 0.1em;
  position: absolute;
  top: 66%;
  text-transform: uppercase;
}

.Dial-bg {
  stroke: var(--color-background-lightest);
}

.Dial-fill {
  position: absolute;
  transform-origin: center;
  -webkit-app-region: no-drag;
}

.Dial-fill--work {
  stroke: var(--color-focus-round);
}

.Dial-fill--shortBreak {
  stroke: var(--color-short-round);
}

.Dial-fill--longBreak {
  stroke: var(--color-long-round);
}
</style>
