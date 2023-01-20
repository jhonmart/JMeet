import Peer from "peerjs";

export default ({ store }) => {
  var peer = new Peer();
  store.commit("setPeerInst", peer);

  peer.on("open", function (uid) {
    store.commit("setMyUID", uid);
  });
  peer.on("call", function (call) {
    store.commit("addCall", call);
    call.on("stream", function (remoteStream) {
      store.commit("addStream", remoteStream);
    });
  });
  peer.on("connection", function (conn) {
    store.commit("addChat", conn);
    sharedMedia.users[conn.peer] = conn;
    conn.on("data", function (data) {
      store.commit("setMsg", data);
    });
  });
};
