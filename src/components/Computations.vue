<template>
  <div
    class="mt-5 mb-3 pa-3 d-flex align-center"
    :style="`outline: 2px solid ${outlineColor}; border-radius: 5px; color: ${textColor}`"
  >
    <v-icon class="me-5" :style="`color: ${iconColor}`"> {{ icon }}</v-icon>
    <span
      >{{ text }} <strong>{{ comp }}</strong> alumnos</span
    >
  </div>
</template>

<script>
export default {
  props: ["icon", "text", "comp", "outlineColor", "textColor", "iconColor"],
};
</script>

<style></style>
