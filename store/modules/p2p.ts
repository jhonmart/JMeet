import { ActionContext } from "vuex/types";
import {
  ISendFileUID,
  ISendTextUID,
  IVideoConstraints,
} from "@/store/types/P2P";
import Peer, { DataConnection, MediaConnection } from "peerjs";
import { ToastProgrammatic as Toast } from "buefy";

const state = {
  myUID: "",
  audio: false,
  microphone: false,
  video: false as boolean | IVideoConstraints,
  screnn: false,
  peerInstance: {} as Peer,
  calls: [] as MediaConnection[],
  conn: {} as { [key: string]: DataConnection },
  users: {} as { [key: string]: DataConnection },
  chats: [] as DataConnection[],
  streams: [] as MediaStream[],
  myStream: null as MediaStream | null,
  actualMessage: null as any,
};

type State = typeof state;

const mutations = {
  setAudio(state: State, status: boolean) {
    state.audio = status;
  },
  setMic(state: State, status: boolean) {
    state.microphone = status;
  },
  setVideo(state: State, config: boolean | IVideoConstraints) {
    state.video = config;
  },
  setScreen(state: State, status: boolean) {
    state.screnn = status;
  },
  setMyUID(state: State, uid: string) {
    state.myUID = uid;
  },
  setPeerInst(state: State, inst: Peer) {
    state.peerInstance = inst;
  },
  addUser(state: State, user: DataConnection) {
    state.users[user.peer] = user;
  },
  addChat(state: State, chat: DataConnection) {
    state.chats.push(chat);
  },
  addCall(state: State, call: MediaConnection) {
    state.calls.push(call);
  },
  addStream(state: State, stream: MediaStream) {
    state.streams.push(stream);
  },
  addConnection(state: State, conn: DataConnection) {
    state.conn[conn.peer] = conn;
  },
  removeConnection(state: State, uid: string) {
    delete state.conn[uid];
  },
  setMsg(state: State, msg: any) {
    state.actualMessage = msg;
  },
  setMyStream(state: State, stream: MediaStream) {
    state.myStream = stream;
  },
  showFail(_: State, message: string) {
    Toast.open({
      message,
      duration: 8000,
      type: "is-danger",
    });
  },
  showSuccess(_: State, message: string) {
    Toast.open({
      message,
      duration: 5000,
      type: "is-green",
    });
  },
};

const actions = {
  createNewConnectionAction: async (
    { commit, state }: ActionContext<State, any>,
    uid: string
  ) => {
    const newConn = state.peerInstance.connect(uid);
    commit("addConnection", newConn);
    return newConn;
  },
  sharedScreenAction: async (
    { commit, state }: ActionContext<State, any>,
    uid: string
  ) => {
    const { getDisplayMedia } = navigator.mediaDevices;
    try {
      const captureScreenStream: MediaStream = await getDisplayMedia({
        video: state.video,
        audio: state.audio,
      });
      commit("setMyStream", captureScreenStream);
      if (state.calls.length) {
        state.calls.forEach((channel) => channel.answer(captureScreenStream));
      } else {
        const newCall = state.peerInstance.call(uid, captureScreenStream);
        commit("addCall", newCall);
        newCall.on("stream", function (remoteStream) {
          commit("addStream", remoteStream);
        });
      }
    } catch (error) {
      commit("showFail", "Houver uma falha!");
      return error;
    }
  },
  sharedCamAction: async (
    { commit, state }: ActionContext<State, any>,
    uid: string
  ) => {
    const { getUserMedia } = navigator.mediaDevices;
    try {
      const captureCamStream: MediaStream = await getUserMedia({
        video: state.video,
        audio: state.audio,
      });
      commit("setMyStream", captureCamStream);
      if (state.calls.length) {
        state.calls.forEach((channel) => channel.answer(captureCamStream));
      } else {
        const newCall = state.peerInstance.call(uid, captureCamStream);
        commit("addCall", newCall);
        newCall.on("stream", function (remoteStream) {
          commit("addStream", remoteStream);
        });
      }
    } catch (error) {
      commit("showFail", "Houver uma falha!");
      return error;
    }
  },
  sendFileAction: async (
    { commit, dispatch, state }: ActionContext<State, any>,
    { file, uid }: ISendFileUID
  ) => {
    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = function (evt) {
        if (evt.target?.readyState == FileReader.DONE) {
          let fileObj = {};
          try {
            fileObj = {
              name: file.name,
              type: file.type,
              data: evt.target.result,
            };
          } catch (error) {
            fileObj = {
              name: file.name,
              type: file.type,
              data: [],
            };
          }

          if (state.conn.length) {
            for (let uidActual in state.conn)
              state.conn[uidActual].send(fileObj);
          } else {
            dispatch("createNewConnectionAction", uid).then((conn) =>
              conn.send(fileObj)
            );
          }
        }
      };
    } catch (error) {
      commit("showFail", "Houver uma falha!");
      return error;
    }
  },
  sendTextAction: async (
    { commit, dispatch, state }: ActionContext<State, any>,
    { text, uid }: ISendTextUID
  ) => {
    try {
      if (state.conn.length) {
        for (let uidActual in state.conn) {
          state.conn[uidActual].send(text);
        }
      } else {
        dispatch("createNewConnectionAction", uid).then((conn) =>
          conn.send(text)
        );
      }
    } catch (error) {
      commit("showFail", "Houver uma falha!");
      return error;
    }
  },
  stopStreamAction: async ({ commit, state }: ActionContext<State, any>) => {
    try {
      state.myStream?.getTracks()?.forEach((track) => {
        debugger;
        track.enabled = false;
        track.stop();
      });
    } catch (error) {
      commit("showFail", "Houver uma falha!");
      return error;
    }
  },
};

const getters = {
  getVideo: (state: State) => state.video,
  getAudio: (state: State) => state.audio,
  getActualMsg: (state: State) => state.actualMessage,
};

export default {
  state: () => state,
  mutations,
  actions,
  getters,
};
