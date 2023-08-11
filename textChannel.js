const offer = {};
const peerConnection = new RTCPeerConnection;
peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      console.log(
        "before createOffer",
        JSON.stringify(peerConnection.localDescription)
      );
      document.getElementById(sdpType).value = JSON.stringify(
        peerConnection.localDescription
      );
      //   document.getElementById(sdpType).value = JSON.stringify(
      //    'empty'
      //   );
    }
  };

peerConnection.ondatachannel = (e) => {
    peerConnection.dataChannel = e.channel;
    peerConnection.dataChannel.onmessage = (e) => {
        console.log('new message from client' + e.data)
    }
    peerConnection.dataChannel.onopen = (e) => {
        console.log('Connection open')
    }
}
 
await peerConnection.setRemoteDescription(offer) 

await peerConnection.createAnswer().then(a => peerConnection.setLocalDescription(a)).then(a => console.log('answer created'))
