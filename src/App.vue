<template>
  <div id="app">
    <app-titlebar />
    <transition name="slide-left" mode="out-in">
      <app-drawer v-if="settings.drawerOpen" />
    </transition>
    <app-timer />
    <app-notification-win v-if="settings.os === 'win32' && settings.notifications" />
    <app-notification v-else-if="settings.os !== 'win32' && settings.notifications" />
  </div>
</template>

<script lang="ts" setup>
import appDrawer from "@/components/drawer/Drawer.vue";
import appNotification from "@/components/notification/Notification.vue";
import appNotificationWin from "@/components/notification/Notification-win.vue";
import appTimer from "@/components/timer/Timer.vue";
import appTitlebar from "@/components/Titlebar.vue";
import { useViewStore, useTimerStore } from "@/store";

const { settings } = useViewStore();
</script>

<style lang="scss">
#app {
  animation: fade-in 0.5s ease forwards;
  position: relative;
  overflow: hidden;
  height: 100vh;
}
</style>
