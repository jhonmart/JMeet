import Peer from "peerjs";

export default ({ store }) => {
  var peer = new Peer();
  store.commit("setPeerInst", peer);

  peer.on("open", function (uid) {
    store.commit("setMyUID", uid);
  });
  peer.on("close", function () {
    store.commit("setMyUID", "");
  });
  peer.on("call", function (call) {
    store.commit("addCall", call);
    call.on("stream", function (remoteStream) {
      store.commit("addStream", remoteStream);
    });
  });
  peer.on("connection", function (conn) {
    store.commit("addConnection", conn);
    conn.on("data", function (data) {
      store.commit("setMsg", data);
    });
  });
  peer.on("disconnected", function (uid) {
    store.commit("removeConnection", uid);
  });
};
