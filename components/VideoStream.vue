<template>
  <video autoplay="" ref="video" :style="{width, height}" />
</template>

<script>
export default {
  name: "VideoStream",
  props: {
    stream: {
      required: true
    },
    width: {
      type: String,
      default: "30vh"
    },
    height: {
      type: String,
      default: "30vh"
    }
  },
  mounted() {
    if (this.stream?.id) this.$refs.video.srcObject = this.stream;
  }
};
</script>
<style scoped>
video {
  background-color: #303135;
}
</style>
