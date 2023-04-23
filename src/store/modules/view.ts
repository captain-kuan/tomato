import { defineStore } from "pinia";

interface Settings {
  currentDrawer: string;
  drawerOpen: boolean;
  autoStartWorkTimer: boolean;
  autoStartBreakTimer: boolean;
  alwaysOnTop: boolean;
  breakAlwaysOnTop: boolean;
  minToTray: boolean;
  minToTrayOnClose: boolean;
  notifications: boolean;
  os: string;
  theme: string;
}
export const useViewStore = defineStore("view", () => {
  const settings = reactive<Settings>({
    currentDrawer: "appDrawerTimer",
    drawerOpen: false,
    autoStartWorkTimer: true,
    autoStartBreakTimer: true,
    alwaysOnTop: false,
    breakAlwaysOnTop: false,
    minToTray: false,
    minToTrayOnClose: false,
    notifications: false,
    os: "",
    theme: "Pomotroid",
  });
  function setViewState<T extends keyof Settings>(param: {
    key: T;
    value: Settings[T];
  }) {
    settings[param.key] = param.value;
  }
  function toggleSetting(
    key:
      | "drawerOpen"
      | "autoStartWorkTimer"
      | "autoStartBreakTimer"
      | "alwaysOnTop"
      | "breakAlwaysOnTop"
      | "notifications"
      | "minToTray"
      | "minToTrayOnClose"
  ) {
    settings[key] = !settings[key];
  }
  return {
    settings,
    toggleSetting,
    setViewState,
  };
});
