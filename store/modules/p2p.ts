import { ActionContext } from "vuex/types";
import {
  ISendFileUID,
  ISendTextUID,
  IUserStream,
  IUserStreamList,
  IVideoConstraints,
} from "@/store/types/P2P";
import Peer, { DataConnection, MediaConnection } from "peerjs";
import { ToastProgrammatic as Toast } from "buefy";

const state = {
  myUID: "",
  audio: false,
  microphone: false,
  video: false as boolean | IVideoConstraints,
  screnn: {
    frameRate: { ideal: 24, max: 30 },
    facingMode: "user"
  } as IVideoConstraints,
  peerInstance: {} as Peer,
  calls: [] as MediaConnection[],
  conn: [] as DataConnection[],
  chats: [] as DataConnection[],
  streams: {} as IUserStreamList,
  myStream: {} as MediaStream,
  actualMessage: null as any,
  chatState: false
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
  setScreen(state: State, status: IVideoConstraints) {
    state.screnn = status;
  },
  setMyUID(state: State, uid: string) {
    state.myUID = uid;
  },
  setPeerInst(state: State, inst: Peer) {
    state.peerInstance = inst;
  },
  addChat(state: State, chat: DataConnection) {
    state.chats.push(chat);
  },
  addCall(state: State, call: MediaConnection) {
    state.calls.push(call);
  },
  addStream(state: State, message: IUserStream) {
    state.streams[message.uid] = message.stream;
  },
  setChatState(state: State, status: boolean) {
    state.chatState = status;
  },
  addConnection(state: State, conn: DataConnection) {
    if (!conn.peer) return;
    let indexConn = state.conn.findIndex(connection => connection.peer === conn.peer);
    if (indexConn < 0)
      state.conn.push(conn);
    else state.conn[indexConn] = conn;
  },
  removeConnection(state: State, uid: string) {
    const index = state.conn.findIndex(user => user.peer !== uid);
    state.conn.splice(index, 1);
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
declare global {
  interface HTMLCanvasElement {
    captureStream(frameRate?: number): MediaStream;
  }
  interface MediaDevices {
    getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
  }
}

const actions = {
  fakeMediaStream: (_: ActionContext<State, any>) => {
    const staticImage = new Image(400, 400);
    staticImage.src = require("@/assets/backload.jpeg");
    var canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    var ctx = canvas.getContext("2d");
    ctx?.drawImage(staticImage, 0, 0);
    return canvas.captureStream();
  },
  createNewConnectionAction: async (
    { commit, state }: ActionContext<State, any>,
    uid: string
  ) => {
    const newConn = state.peerInstance.connect(uid);
    commit("addConnection", newConn);
    newConn.on("data", function (data) {
      commit("setMsg", data);
    });
    newConn.on('open', function(){
      commit("showSuccess", "Um usuário conectou");
    });
    newConn.on('close', function(){
      commit("showSuccess", "Um usuário desconectou");
    });
    return newConn;
  },
  createNewCallAction: async (
    { commit, state, dispatch }: ActionContext<State, any>,
    uid: string
  ) => {
    const fakeStream = await dispatch("fakeMediaStream");
    const newConn = state.peerInstance.call(uid, fakeStream);
    commit("setMyStream", fakeStream);
    commit("addCall", newConn);
    return newConn;
  },
  screenStreamAction: async (
    { commit, state }: ActionContext<State, any>
  ) => {
    try {
      if (!navigator.mediaDevices) {
        return commit("showFail", "Houve um erro ao acessar o plugin!");
      }
      const captureScreenStream: MediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: state.screnn,
        audio: state.audio,
      });
      commit("setMyStream", captureScreenStream);
      if (state.calls.length) {
        state.calls.forEach((channel) => channel.answer(captureScreenStream));
      }
      return true;
    } catch (error) {
      commit("showFail", "Houve um erro ao tentar iniciar a captura de tela!");
      console.error(error);
      return false;
    }
  },
  sharedMyStream: async (
    { commit, state }: ActionContext<State, any>
  ) => {
    try {
      if (state.calls.length) {
        state.calls.forEach((channel) => channel.answer(state.myStream));
      }
      return true;
    } catch (error) {
      commit("showFail", "Houve um erro ao tentar transimitir o stream!");
      console.error(error);
      return false;
    }
  },
  sharedScreenAction: async (
    { commit, state }: ActionContext<State, any>,
    uid: string
  ) => {
    try {
      if (state.myStream) {
        const captureScreenStream: MediaStream | Boolean = state.myStream;
        const newCall = state.peerInstance.call(uid, captureScreenStream);
        commit("addCall", newCall);
        newCall.on("stream", function (remoteStream) {
          commit("addStream", remoteStream);
        });
        return true;
      } else {
        commit("showFail", "Não existe captura de tela!");
        return false;
      }
    } catch (error) {
      commit("showFail", "Houve um erro ao tentar iniciar o compartilhamento de tela!");
      console.error(error);
      return false;
    }
  },
  camStreamAction: async (
    { commit, state }: ActionContext<State, any>
  ) => {
    try {
      // const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      const { getUserMedia } = navigator.mediaDevices;
      const captureCamStream: MediaStream = await getUserMedia({
        video: state.video || state.screnn,
        audio: state.audio,
      });
      commit("setMyStream", captureCamStream);
      if (state.calls.length) {
        state.calls.forEach((channel) => channel.answer(captureCamStream));
      }
      return true;
    } catch (error) {
      commit("showFail", "Houve um erro ao tentar iniciar a captura de video!");
      return false;
    }
  },
  sharedCamAction: async (
    { commit, state }: ActionContext<State, any>,
    uid: string
  ) => {
    try {
      if (state.myStream) {
        const captureCamStream: MediaStream = state.myStream;
        const newCall = state.peerInstance.call(uid, captureCamStream);
        commit("addCall", newCall);
        newCall.on("stream", function (remoteStream) {
          commit("addStream", remoteStream);
        });
        return true;
      } else {
        commit("showFail", "Não existe captura de video!");
        return false;
      }
    } catch (error) {
      commit("showFail", "Houve um erro ao tentar iniciar o compartilhamento de video!");
      console.error(error);
      return false;
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
              conn.send(fileObj) //ƒ (data, chunked)
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
      console.error(error);
      return error;
    }
  },
  stopStreamAction: async ({ commit, state }: ActionContext<State, any>) => {
    try {
      state.myStream?.getTracks()?.forEach((track) => {
        track.enabled = false;
        track.stop();
        commit("setMyStream", {});
      });
    } catch (error) {
      commit("showFail", "Houver uma falha!");
      return error;
    }
  },
};

const getters = {
  getUID: (state: State) => state.myUID,
  getVideo: (state: State) => state.video,
  getAudio: (state: State) => state.audio,
  getActualMsg: (state: State) => state.actualMessage,
  getMyStream: (state: State) => state.myStream,
  getStreams: (state: State) => Object.values(state.streams),
  getCalls: (state: State) => state.calls,
  getPeer: (state: State) => state.peerInstance,
  getChatState: (state: State) => state.chatState
};

export default {
  state: () => state,
  mutations,
  actions,
  getters,
};
