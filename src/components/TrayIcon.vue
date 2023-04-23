<template></template>

<script lang="ts" setup>
import { EventBus } from "@/utils/EventBus";
import { useViewStore } from "@/store";

const currentRound = ref();
const paused = ref(true);
const lastElapsed = ref(0);
const total = ref(1);
const { settings } = useViewStore();

onMounted(() => {
  const updateTrayImage = (elapsed: number, total: number) => {
    if (!settings.minToTray) {
      return;
    }
    if (
      !paused.value &&
      lastElapsed.value < elapsed &&
      (elapsed - lastElapsed.value) / total < 0.01
    ) {
      // avoid updates without visual difference
      return;
    }
    lastElapsed.value = elapsed;
    total = total;
    const image = createTrayImage(currentRound.value, paused.value, lastElapsed.value, total);
  };

  EventBus.on("ready-long-break", () => {
    currentRound.value = "long-break";
    lastElapsed.value = -1;
    updateTrayImage(0, 1);
  });

  EventBus.on("ready-short-break", () => {
    currentRound.value = "short-break";
    lastElapsed.value = -1;
    updateTrayImage(0, 1);
  });

  EventBus.on("ready-work", () => {
    currentRound.value = "work";
    lastElapsed.value = -1;
    updateTrayImage(0, 1);
  });

  EventBus.on("timer-reset", () => {
    paused.value = true;
    lastElapsed.value = -1;
    updateTrayImage(0, 1);
  });

  EventBus.on("timer-tick", (payload: any) => {
    updateTrayImage(payload.elapsed, payload.total);
  });

  EventBus.on("timer-started", () => {
    paused.value = false;
    updateTrayImage(lastElapsed.value, total.value);
  });

  EventBus.on("timer-paused", () => {
    paused.value = true;
    updateTrayImage(lastElapsed.value, total.value);
  });

  EventBus.on("timer-completed", () => {
    paused.value = true;
    updateTrayImage(lastElapsed.value, total.value);
  });

  updateTrayImage(lastElapsed.value, total.value);
});

function createTrayImage(
  currentRound: string,
  paused: boolean,
  elapsed: number,
  total: number
) {
  const bgVar =
    document.documentElement.style.getPropertyValue("--color-background");
  const focusVar = document.documentElement.style.getPropertyValue(
    "--color-focus-round"
  );
  const shortVar = document.documentElement.style.getPropertyValue(
    "--color-short-round"
  );
  const longVar =
    document.documentElement.style.getPropertyValue("--color-long-round");
  const size = setSizeTrayImage();
  const bgColor = !bgVar ? "#2F384B" : bgVar;
  const workColor = !focusVar ? "#FF4E4D" : focusVar;
  const shortBreakColor = !shortVar ? "#05EB8B" : shortVar;
  const longBreakColor = !longVar ? "#0BBCDA" : longVar;
  const arcRadiusRatio = 0.55;
  const arcLineWidthRatio = 0.3;

  const remainingTime = 1 - elapsed / total;
  const fgColor =
    currentRound === "short-break"
      ? shortBreakColor
      : currentRound === "long-break"
      ? longBreakColor
      : workColor;
  const outerRadius = size / 2;
  const innerRadius = outerRadius * arcRadiusRatio;
  const lineWidth = outerRadius * arcLineWidthRatio;
  const fullCircle = 2 * Math.PI;
  const startAngle = -Math.PI / 2;
  const endAngle = remainingTime * fullCircle + startAngle;
  const center = outerRadius;
  const pauseStrokesHalfDistance = innerRadius / 1.7;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (ctx == null) return;
  ctx.fillStyle = bgColor;
  ctx.strokeStyle = fgColor;
  ctx.lineWidth = lineWidth;

  ctx.beginPath();
  ctx.arc(center, center, outerRadius, 0, fullCircle, false);
  ctx.fill();

  if (paused) {
    ctx.beginPath();
    ctx.moveTo(center - pauseStrokesHalfDistance, center - innerRadius);
    ctx.lineTo(center - pauseStrokesHalfDistance, center + innerRadius);
    ctx.moveTo(center + pauseStrokesHalfDistance, center - innerRadius);
    ctx.lineTo(center + pauseStrokesHalfDistance, center + innerRadius);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(center, center, innerRadius, startAngle, endAngle, false);
    ctx.stroke();
  }

  const dataUrl = canvas.toDataURL("image/png");
  return dataUrl;
}

function setSizeTrayImage() {
  return process.platform === "darwin" ? 19 : 32;
}
</script>
