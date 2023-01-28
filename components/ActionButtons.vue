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
      :type="videoState ? 'is-dark-google' : 'is-blood'"
      @click="sharedCam"
    >
      <b-icon :icon="videoState ? 'video-outline' : 'video-off-outline'" />
    </b-button>
    <b-button
      class="is-ball-medium active"
      :type="audioState ? 'is-dark-google' : 'is-blood'"
      rounded
      @click="audioState = !audioState"
    >
      <b-icon :icon="audioState ? 'microphone' : 'microphone-off'" />
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
      ref="actionsGruper"
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
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: "ActionButton",
  data() {
    return {
      video: false,
      microphone: false,
    };
  },
  computed: {
    ...mapGetters(["getAudio", "getVideo", "getUID"]),
    audioState: {
      get() {
        return this.getAudio;
      },
      set(newValue) {
        this.setAudio(newValue);
      }
    },
    videoState: {
      get() {
        return this.getVideo;
      },
      set(newValue) {
        this.setVideo(newValue);
      }
    }
  },
  methods: {
    ...mapMutations(["setAudio", "setVideo", "showFail", "setChatState"]),
    ...mapActions(["camStreamAction", "screenStreamAction", "stopStreamAction", "sharedScreenAction"]),
    stopCapture() {
      this.stopStreamAction();
    },
    async sharedCam() {
      try {
        const result = await this.camStreamAction();
        if (result)
          this.videoState = !this.videoState;
      } catch (error) {
        console.error(error);
      }
    },
    sharedScreen() {
      this.screenStreamAction();
    },
    showOrHiddenChat() {
      this.setChatState(true);
    },
    generateRoomLink() {
      try {
        const link = `${location.origin}/JMeet/reuniao/${this.getUID}`;
        window.navigator.clipboard.writeText(link);
        this.$buefy.toast.open({ message: "Link copiado!", type: "is-green" });
        this.$refs.actionsGruper.close();
      } catch (error) {
        this.$buefy.toast.open({ message: "Falha ao copiar!", type: "is-warning" });
      }
    }
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
