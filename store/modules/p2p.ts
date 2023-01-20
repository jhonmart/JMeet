import { ActionContext } from "vuex/types";
import { IVideoConstraints } from "@/store/types/P2P";
import Peer, { DataConnection } from "peerjs";

const state = {
  myUID: "",
  audio: false,
  microphone: false,
  video: false as boolean | IVideoConstraints,
  screnn: false,
  peerInstance: {} as Peer,
  calls: [] as DataConnection[],
  conn: {} as {[key: string]: DataConnection},
  users: {} as {[key: string]: DataConnection},
  chats: [] as DataConnection[],
  streams: [] as MediaStream[],
  actualMessage: null as any
};

type State = typeof state;

const mutations = {
  setAudio (state: State, status: boolean) {
    state.audio = status;
  },
  setMic (state: State, status: boolean) {
    state.microphone = status;
  },
  setVideo (state: State, config: boolean | IVideoConstraints) {
    state.video = config;
  },
  setScreen (state: State, status: boolean) {
    state.screnn = status;
  },
  setMyUID (state: State, uid: string) {
    state.myUID = uid;
  },
  setPeerInst (state: State, inst: Peer) {
    state.peerInstance = inst;
  },
  addUser (state: State, user: DataConnection) {
    state.users[user.peer] = user;
  },
  addChat (state: State, chat: DataConnection) {
    state.chats.push(chat);
  },
  addCall (state: State, call: DataConnection) {
    state.calls.push(call);
  },
  addStream (state: State, stream: MediaStream) {
    state.streams.push(stream);
  },
  setMsg (state: State, msg: any) {
    state.actualMessage = msg;
  }
};

const actions = {
  createNewConnection: async (
    { commit, state }: ActionContext<State, any>,
    uid: string
  ) => {
    commit("addChat", state.peerInstance.connect(uid));
  },
};

const getters = {
  getVideo: (state: State) => state.video,
  getAudio: (state: State) => state.audio,
};

export default {
  state: () => state,
  mutations,
  actions,
  getters
};
