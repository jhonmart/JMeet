import Peer from "peerjs";

export default ({ store }) => {
  var peer = new Peer();
  store.commit("setPeerInst", peer);

  peer.on("open", function (uid) {
    store.commit("showSuccess", "Você está conectado");
    store.commit("setMyUID", uid);
  });
  peer.on("close", function () {
    store.commit("Você está desconectado");
    store.commit("setMyUID", "");
  });
  peer.on("call", function (call) {
    store.commit("showSuccess", "Recebendo uma chamada");
    store.commit("addCall", call);
    call.on("stream", function (remoteStream) {
      store.commit("addStream", { uid: call.peer, stream: remoteStream });
    });
  });
  peer.on("connection", function (conn) {
    store.commit("showSuccess", "Um usuário conectou");
    store.commit("addConnection", conn);
    conn.on("data", function (data) {
      store.commit("setMsg", data);
    });
    conn.on('open', function(){
      store.commit("showSuccess", "Um usuário conectou");
    });
    conn.on('close', function(){
      store.commit("showSuccess", "Um usuário desconectou");
    });
  });
  peer.on("disconnected", function (uid) {
    store.commit("showSuccess", "Um usuário desconectou");
    store.commit("removeConnection", uid);
  });
};
