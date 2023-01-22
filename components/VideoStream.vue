<template>
  <video autoplay="" ref="video" :style="{width, height}" />
</template>

<script>
export default {
  name: "VideoStream",
  props: {
    stream: {
      type: [Object, Boolean, undefined],
      required: false,
      default: null,
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
    if (this.stream) this.$refs.video.srcObject = this.stream;
  }
};
</script>
<style scoped>
video {
  background-color: #303135;
}
</style>
