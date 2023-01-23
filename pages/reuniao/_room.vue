<template>
  <section class="pt-2">
    <div class="stream-user">
      <video
        autoplay
        :poster="waitConnection"
        :srcObject.prop="getMyStream"
        :style="{ width: '100%', height: '100%' }"
        class="background"
      />
    </div>
    <ActionButtons class="action-buttons" />
    <b-button
      :disabled="!stateConnection"
      type="is-green"
      @click="connectRoom"
      class="action-connect"
      >Conectar</b-button
    >
  </section>
</template>

<script>
import ActionButtons from "@/components/ActionButtons.vue";
import waitConnection from "@/assets/waitConnection.webp";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  components: { ActionButtons },
  name: "RoomPage",
  data() {
    return {
      waitConnection,
      stateConnection: false,
    };
  },
  computed: {
    ...mapGetters(["getCalls", "getMyStream", "getStreams", "getPeer"]),
    roomID() {
      return this.$route.params.room;
    },
  },
  watch: {
    getPeer: {
      handler({ _open }) {
        if (_open) this.createNewConnectionAction(this.roomID);
        this.stateConnection = _open;
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    ...mapMutations(["addStream", "showSuccess"]),
    ...mapActions(["createNewCallAction", "createNewConnectionAction"]),
    connectRoom() {
      this.createNewCallAction(this.roomID);
      this.showSuccess("Conectado a sala");
      this.$router.replace("/reuniao")
    },
  },
};
</script>

<style lang="scss" scoped>
section {
  display: grid;
  grid-template-columns: 20px repeat(3, 1fr) 300px 20px;
  grid-template-rows: 20px repeat(3, 0.25fr) 20px 100px;
  @media screen and (max-width: 769px) {
    grid-template-columns: 20px repeat(4, 1fr) 20px;
    grid-template-rows: 20px 50vh 25vh 100px;
  }

  .stream-user {
    grid-column: 2/5;
    grid-row: 2/5;
    @media screen and (max-width: 769px) {
      grid-row: 2;
      grid-column: 2/6;
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
  .action-connect {
    grid-column: 5;
    grid-row: 7;
    @media screen and (max-width: 769px) {
      grid-row: 5;
      grid-column: 2/6;
    }
  }
}
</style>
