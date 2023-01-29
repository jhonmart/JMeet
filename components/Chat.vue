<template>
  <section>
    <header class="is-flex">
      <b-button rounded type="is-ghost" size="is-small" class="is-small" title="Fechar o chat" @click="hiddenChat">
        <b-icon icon="close" type="is-danger" />
      </b-button>
    </header>
    <aside
      ref="chatOutput"
    >
      <div
        v-for="({ me, body, date }, index) in history"
        :key="`message_${index}`"
        class="message"
        :class="{'my-message': me}"
      >
        <span class="has-text-white">{{ message.body }}</span>
        <span>
          <b>{{ me ? "Você" : "Amigo" }}</b>
          <span>{{ date }}</span>
        </span>
        <span> {{ body }} </span>
      </div>
    </aside>
    <form ref="chatForm">
      <!-- <input type="file" id="fileChat" class="hidden" /> -->
      <!-- <select id="camMeet" class="hidden">
        <option value="stream">Frente</option>
        <option value="environment">Trás</option>
      </select> -->
      <div class="is-flex width-100 px-1">
        <b-input
          class="flex-1"
          v-model="message"
          placeholder="Digite sua mensagem"
        />
        <b-button native-type="submit" type="is-green" class="ml-1">
          <b-icon icon="send" />
        </b-button>
      </div>
    </form>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "Chat",
  data() {
    return {
      history: [],
      message: "",
    };
  },
  computed: {
    ...mapGetters(["getActualMsg"]),
  },
  watch: {
    async getActualMsg(newMessage) {
      this.history.push({
        body: newMessage,
        me: false,
        date: new Date().toLocaleTimeString(navigator.language, {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    },
    async history() {
      await this.$nextTick();
      this.$refs.chatOutput.scroll(0, this.$refs.chatOutput.scrollHeight);
    }
  },
  mounted() {
    this.$refs.chatForm.addEventListener("submit", this.sendMessage);
  },
  destroyed() {
    this.$refs.chatForm?.removeEventListener("submit", this.sendMessage);
  },
  methods: {
    ...mapActions(["sendTextAction"]),
    ...mapMutations(["showFail", "setChatState"]),
    async sendMessage(ev) {
      ev.preventDefault();
      if (!this.message) return this.showFail("Digite a mensagem!");
      this.sendTextAction({ text: this.message });
      this.history.push({
        body: this.message,
        me: true,
        date: new Date().toLocaleTimeString(navigator.language, {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      this.message = "";
    },
    hiddenChat() {
      this.setChatState(false);
    }
  },
};
</script>

<style lang="scss" scoped>
aside {
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: calc(100vh - 74px);
  overflow: auto;
}
.message {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px;
  span {
    b {
      margin-right: 10px;
    }
    span {
      color: #afafaf;
    }
  }
  &.my-message {
    align-items: flex-end;
  }
}
</style>
