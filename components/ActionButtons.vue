<template>
  <section class="actions-container">
    <b-button
      rounded
      size="is-big"
      type="is-blood"
      @click="stopCapture"
      class="is-ball"
    >
      <b-icon icon="phone-hangup" />
    </b-button>
    <b-button
      class="is-ball-medium active"
      rounded
      :type="video ? 'is-dark-google' : 'is-blood'"
      @click="sharedCam"
    >
      <b-icon :icon="video ? 'video-outline' : 'video-off-outline'" />
    </b-button>
    <b-button
      class="is-ball-medium active"
      :type="microphone ? 'is-dark-google' : 'is-blood'"
      rounded
      @click="setMic"
    >
      <b-icon :icon="microphone ? 'microphone' : 'microphone-off'" />
    </b-button>
    <b-button
      type="is-dark-google"
      class="is-ball-medium"
      rounded
      @click="sharedScreen"
    >
      <b-icon icon="presentation" />
    </b-button>
    <b-tooltip
      type="is-dark-blue"
      :triggers="['click']"
      :auto-close="['outside', 'escape']"
    >
      <template v-slot:content>
        <b-button
          type="is-dark-google"
          class="is-ball-medium"
          rounded
          @click="showOrHiddenChat"
        >
          <b-icon icon="message-outline" />
        </b-button>
        <b-button
          type="is-dark-google"
          class="is-ball-medium"
          rounded
          @click="generateRoomLink"
        >
          <b-icon icon="account-multiple" />
        </b-button>
        <b-button type="is-dark-google" class="is-ball-medium" rounded>
          <b-icon icon="hand" />
        </b-button>
      </template>
      <b-button type="is-dark-google" class="is-ball-medium" rounded>
        <b-icon icon="dots-vertical" />
      </b-button>
    </b-tooltip>
  </section>
</template>

<script>
export default {
  name: "ActionButton",
  data() {
    return {
      video: false,
      microphone: false,
    };
  },
  methods: {
    stopCapture() {},
    sharedCam() {
      this.video = !this.video;
    },
    setMic() {
      this.microphone = !this.microphone;
    },
    sharedScreen() {},
    showOrHiddenChat() {},
    generateRoomLink() {},
  },
};
</script>

<style lang="scss" scoped>
.is-ball {
  width: 50px;
  height: 50px;
  &-medium {
    width: 40px;
    height: 40px;
  }
}
.is-dark-google {
  box-shadow: 0px 1px 3px #1c1d1c;
}
.actions-container {
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
}
</style>
