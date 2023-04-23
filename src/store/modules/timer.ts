import { defineStore } from "pinia";
interface TimerSettings {
  tickSounds: boolean;
  tickSoundsDuringBreak: boolean;
}
interface GlobalShortcut {
  callTimerToggle: string;
  callTimerReset: string;
  callTimerSkip: string;
}
export const useTimerStore = defineStore("timer", () => {
  const timerSettings = reactive<TimerSettings>({
    tickSounds: false,
    tickSoundsDuringBreak: false,
  });
  const round = ref(1);
  const workRounds = ref(0);
  const totalWorkRounds = ref(0);
  const tickSounds = ref(false);
  const tickSoundsDuringBreak = ref("");
  const timeLongBreak = ref(0);
  const timeShortBreak = ref(0);
  const timeWork = ref(0);
  const currentRound = ref("work");
  const volume = ref(100);
  const globalShortcut = reactive<GlobalShortcut>({
    callTimerToggle: "",
    callTimerReset: "",
    callTimerSkip: "",
  });
  function toggleTimerSetting(key: "tickSounds" | "tickSoundsDuringBreak") {
    timerSettings[key] = !timerSettings[key];
  }
  function setGlobalShortcut<T extends keyof GlobalShortcut>(
    key: T,
    value: GlobalShortcut[T]
  ) {
    globalShortcut[key] = value;
  }
  return {
    timerSettings,
    toggleTimerSetting,
    setGlobalShortcut,
    round,
    workRounds,
    totalWorkRounds,
    tickSounds,
    tickSoundsDuringBreak,
    timeLongBreak,
    timeShortBreak,
    timeWork,
    currentRound,
    volume,
    globalShortcut,
  };
});
