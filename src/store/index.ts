import type { Plugin, App } from "vue";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
export * from "./modules"

const pinia = createPinia();
pinia.use(
  createPersistedState({
    storage: localStorage,
    auto: true,
  })
);
const store: Plugin = {
  install(app: App) {
    app.use(pinia);
  },
};
export default store;
