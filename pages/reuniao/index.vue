<template>
  <section class="room-section pt-2">
    <div class="stream-main">
      <video
        autoplay
        :poster="waitConnection"
        :srcObject.prop="getStreams[0] || null"
        :style="{ width: '100%', height: '100%' }"
        class="background"
      />
    </div>
    <div class="stream-user">
      <video
        autoplay
        :poster="waitConnection"
        :srcObject.prop="getMyStream"
        :style="{ width: '100%', height: '100%' }"
        class="background"
      />
      <video
        v-for="(stream, sIndex) in getStreams.slice(1)"
        :key="`stream_${sIndex}`"
        :poster="waitConnection"
        autoplay
        :srcObject.prop="stream"
        :style="{ width: '100%', height: '100%' }"
        class="background"
      />
      <!-- <VideoStream
        :stream="stream"
        width="100%"
        height="100%"
      /> -->
    </div>
    <b-sidebar
      type="is-noturno"
      fullheight
      overlay
      right
      v-model="chatState"
      class="is-30w"
      @close="chatState = false"
    >
      <Chat />
    </b-sidebar>
    <ActionButtons class="action-buttons" />
  </section>
</template>

<script>
import VideoStream from "@/components/VideoStream.vue";
import ActionButtons from "@/components/ActionButtons.vue";
import { mapGetters, mapMutations } from "vuex";
import waitConnection from "@/assets/waitConnection.webp";
import Chat from "@/components/Chat.vue";

export default {
  components: { VideoStream, ActionButtons, Chat },
  name: "MeetPage",
  data() {
    return {
      friendStreams: [],
      waitConnection
    }
  },
  computed: {
    ...mapGetters(["getCalls", "getChatState", "getMyStream", "getStreams"]),
    chatState: {
      get() {
        return this.getChatState;
      },
      set(newValue) {
        this.setChatState(newValue);
      }
    }
  },
  watch: {
    getCalls: {
      handler(newValue) {
        // newValue.forEach(call => {
        //   call.on("stream", function (remoteStream) {
        //     this.addStream(remoteStream);
        //   });
        // });
        newValue;
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(["addStream", "setChatState"])
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.room-section {
  display: grid;
  grid-template-columns: 20px repeat(3, 1fr) 300px 20px;
  grid-template-rows: 20px repeat(3, .3fr) 20px 100px;
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
video.background {
  background-color: #303135;
}
</style>
