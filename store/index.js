
import { Store } from "vuex";
import p2pStore from "./modules/p2p";

export default () => new Store({
  modules: {
    p2pStore
  }
});
