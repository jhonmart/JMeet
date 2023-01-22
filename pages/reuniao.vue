<template>
  <section class="pt-2">
    <div class="stream-main">
      <VideoStream :stream="getMyStream" width="100%" height="100%" />
    </div>
    <div class="stream-user">
      <VideoStream
        v-for="(stream, sIndex) in getStreams"
        :stream="stream"
        :key="`stream_${sIndex}`"
        width="100%"
        height="100%"
      />
    </div>
    <ActionButtons class="action-buttons" />
  </section>
</template>

<script>
import VideoStream from "@/components/VideoStream.vue";
import ActionButtons from "@/components/ActionButtons.vue";
import { mapGetters } from "vuex";

export default {
  components: { VideoStream, ActionButtons },
  name: "MeetPage",
  computed: {
    ...mapGetters(["getMyStream", "getStreams"]),
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
section {
  display: grid;
  grid-template-columns: 20px repeat(3, 1fr) 300px 20px;
  grid-template-rows: 20px repeat(3, 1fr) 20px 100px;
  @media screen and (max-width: 769px) {
    grid-template-columns: 20px repeat(4, 1fr) 20px;
    grid-template-rows: 20px 50vh 25vh 100px;
  }
  .stream-main {
    grid-column: 2/5;
    grid-row: 2/5;
    @media screen and (max-width: 769px) {
      grid-row: 2;
      grid-column: 2/6;
    }
  }
  .stream-user {
    grid-row: 2;
    grid-column: 5;
    padding: 0 15px;
    text-align: center;
    @media screen and (max-width: 769px) {
      grid-row: 3;
      grid-column: 3/5;
      padding: 15px 0;
    }
  }
  .action-buttons {
    grid-column: 3/5;
    grid-row: 6;
    @media screen and (max-width: 769px) {
      grid-row: 4;
      grid-column: 1/6;
    }
  }
}
</style>
