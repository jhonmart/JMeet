<template>
  <video autoplay="" :srcObject="stream" :style="{width, height}" />
</template>

<script>
export default {
  name: "VideoStream",
  props: {
    stream: {
      type: Object,
      required: true,
    },
    width: {
      type: String,
      default: "30vh"
    },
    height: {
      type: String,
      default: "30vh"
    }
  }
};
</script>
<style scoped>
video {
  background-color: #303135;
}
</style>
