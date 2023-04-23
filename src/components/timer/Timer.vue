<template>
  <div class="Timer-wrapper">
    <app-audio />
    <app-tray-icon />
    <app-timer-dial
      :current-time="currentTime"
      :minutes="minutes"
      :timerActive="timerActive"
    >
      <p class="Dial-time" v-if="!timerStarted">{{ prettyMinutes }}</p>
      <p class="Dial-time" v-else>{{ prettyTime }}</p>
    </app-timer-dial>

    <section class="Container Button-wrapper">
      <transition name="fade" mode="out-in">
        <div>
          <div
            class="Button"
            v-if="!timerStarted"
            @click="startTimer"
            :key="'start'"
          >
            <div class="Button-icon-wrapper">
              <svg
                version="1.2"
                baseProfile="tiny"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 7.6 15"
                xml:space="preserve"
                height="15px"
                class="Icon--start"
              >
                <polygon
                  fill="var(--color-foreground)"
                  points="0,0 0,15 7.6,7.4 "
                />
              </svg>
            </div>
          </div>
          <div
            class="Button"
            v-if="timerStarted && !timerActive"
            @click="resumeTimer"
            :key="'resume'"
          >
            <div class="Button-icon-wrapper">
              <svg
                version="1.2"
                baseProfile="tiny"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 7.6 15"
                xml:space="preserve"
                height="15px"
              >
                <polygon
                  fill="var(--color-foreground)"
                  points="0,0 0,15 7.6,7.4 "
                />
              </svg>
            </div>
          </div>
          <div
            class="Button"
            v-else-if="timerStarted && timerActive"
            @click="pauseTimer"
            :key="'pause'"
          >
            <div class="Button-icon-wrapper">
              <svg
                version="1.2"
                baseProfile="tiny"
                id="Layer_2"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 10.9 18"
                xml:space="preserve"
                height="15px"
                class="Icon--pause"
              >
                <line
                  fill="none"
                  stroke="var(--color-foreground)"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-miterlimit="10"
                  x1="1.5"
                  y1="1.5"
                  x2="1.5"
                  y2="16.5"
                />
                <line
                  fill="none"
                  stroke="var(--color-foreground)"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-miterlimit="10"
                  x1="9.4"
                  y1="1.5"
                  x2="9.4"
                  y2="16.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </transition>
    </section>

    <app-timer-footer />
    <app-timer-controller />
  </div>
</template>

<script lang="ts" setup>
import { useTimerStore } from "@/store";
import appAudio from '@/components/Audio.vue'
import appTrayIcon from '@/components/TrayIcon.vue'
import appTimerController from '@/components/timer/Timer-controller.vue'
import appTimerDial from '@/components/timer/Timer-dial.vue'
import appTimerFooter from '@/components/timer/Timer-footer.vue'
//@ts-ignore

const { currentRound,timeWork,timeShortBreak,timeLongBreak, } = useTimerStore();
const currentTime = ref(0);
const minutes = ref(1);
const timerActive = ref(false);
const timerStarted = ref(false);
const prettyMinutes = computed(() => minutes.value + ":00");
const timerWorker = new Worker("~@/utils/timer.worker.js");
const prettyTime = computed(() => {
  return `${timeRemaining.value.remainingMinutes}:${timeRemaining.value.remainingSeconds}`;
});

const timeRemaining = computed(() => {
  const time = currentTime.value;
  const elapsedMinutes = Math.floor(time / 60);
  const elapsedSeconds = time - elapsedMinutes * 60;
  const remainingSeconds = formatTimeDouble(60 - elapsedSeconds);
  let remainingMinutes = minutes.value - elapsedMinutes;

  if (elapsedSeconds > 0) {
    remainingMinutes -= 1;
  }

  return {
    remainingMinutes,
    remainingSeconds,
  };
});

function formatTimeDouble(time: number) {
  if (time === 60) {
    return "00";
  } else if (time < 10) {
    return `0${time}`;
  } else {
    return time;
  }
}

function handleMessage(message: MessageEvent) {
  switch (message.data.event) {
    case "complete":
      break;
    case "pause":
      break;
    case "reset":
      break;
    case "resume":
      break;
    case "start":
      break;
    case "tick":
      break;
    default:
      break;
  }
}

function initTimer() {
  switch (currentRound) {
    case "work":
      minutes.value = timeWork;
      createTimer(timeWork);
      break;
    case "short-break":
      minutes.value = timeShortBreak;
      createTimer(timeShortBreak);
      break;
    case "long-break":
      minutes.value = timeLongBreak;
      createTimer(timeLongBreak);
      break;
    default:
      createTimer(25);
      break;
  }
}

function createTimer(min:number) {
  if (!timerWorker) return;
  timerWorker.postMessage({ event: "create", min });
}

function pauseTimer() {
  if (!timerWorker) return;
  timerWorker.postMessage({ event: "pause" });
  timerActive.value = !timerActive;
}

function resetTimer() {
  if (!timerWorker) return;
  timerWorker.postMessage({ event: "reset" });
  timerActive.value = !timerActive;
  timerStarted.value = false;
}

function resumeTimer() {
  if (!timerWorker) return;
  timerWorker.postMessage({ event: "resume" });
  timerActive.value = true;
}

function startTimer() {
  if (!timerWorker) return;
  timerWorker.postMessage({ event: "start" });
  timerActive.value = true;
  timerStarted.value = true;
}
function toggleTimer() {
  if (timerActive.value) {
    pauseTimer();
  } else {
    startTimer();
  }
}
</script>
<style lang="scss" scoped>
.Button {
  border: 2px solid var(--color-background-lightest);
  border-radius: 100%;
  display: flex;
  justify-content: center;
  transition: $transitionDefault;
  width: 50px;
  height: 50px;
  -webkit-app-region: no-drag;
  &:hover {
    background-color: var(--color-background-light);
    & .Icon--pause line {
      stroke: var(--color-accent);
    }
    & .Icon--start polygon {
      fill: var(--color-accent);
    }
  }
}

.Button-wrapper {
  display: flex;
  justify-content: center;
  margin: 20px 0 10px 0;
}

.Button-icon-wrapper {
  align-items: center;
  display: flex;
  height: 100%;
}

.Dial-time {
  font-family: "RobotoMono", monospace;
  font-size: 46px;
  margin: 0;
  position: absolute;
  top: 32%;
}

.Timer-wrapper {
  display: flex;
  flex-direction: column;
}
</style>
