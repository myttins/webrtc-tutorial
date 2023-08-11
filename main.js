let peerConnection;
let localStream;
let remoteStream;

// stun servers (free to use)
let servers = {
  iceServers: [
    {
      urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
    },
  ],
};

// creates initial video feed on left video screen
const init = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  document.getElementById("user-1").srcObject = localStream;
};

const createPeerConnection = async (sdpType) => {
  peerConnection = new RTCPeerConnection(servers);

  // this part just addes video input to the stream of data output (not apart of the initial connection setup)
  remoteStream = new MediaStream();
  document.getElementById("user-2").srcObject = remoteStream;

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = async (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  // part of the initial connection setup
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      console.log(
        "before createOffer",
        JSON.stringify(peerConnection.localDescription)
      );
      document.getElementById(sdpType).value = JSON.stringify(
        peerConnection.localDescription
      );
    }
  };
};

let createOffer = async () => {
  createPeerConnection("offer-sdp");
  let offer = await peerConnection.createOffer(); // resolves to RTCSessionDescription object
  await peerConnection.setLocalDescription(offer); // sets the localDescription on peerConnection
  console.log("after createOffer", JSON.stringify(offer));
  document.getElementById("offer-sdp").value = JSON.stringify(offer);
};

const createAnswer = async () => {
  createPeerConnection("answer-sdp");
  let offer = document.getElementById("offer-sdp").value;
  if (!offer) return alert("Retrieve offer from peer first...");

  offer = JSON.parse(offer);
  await peerConnection.setRemoteDescription(offer);

  let answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  document.getElementById("answer-sdp").value = JSON.stringify(answer);
};

let addAnswer = async () => {
  let answer = document.getElementById("answer-sdp").value;
  if (!answer) return alert("Retrieve answer from peer first...");

  answer = JSON.parse(answer);

  if (!peerConnection.currentRemoteDescription) {
    peerConnection.setRemoteDescription(answer);
  }
};

init();

document.getElementById("create-offer").addEventListener("click", createOffer);
document
  .getElementById("create-answer")
  .addEventListener("click", createAnswer);
document.getElementById("add-answer").addEventListener("click", addAnswer);
