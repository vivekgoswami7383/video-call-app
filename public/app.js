const socket = io("https://7007-150-107-241-75.in.ngrok.io");

let myVideoStream;

const peer = new Peer();

const videoGrid = document.getElementById("video-grid");

const addVideoStream = (video, stream) => {
  myVideoStream = stream;
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};

const StartCallbutton = document.getElementById("startCallButton").addEventListener("click", function () {

  const peer = new Peer();

  peer.on('open' , (id)=>{
    socket.emit("userConnection" , id);
  });

  peer.on('error', (err) => {
    alert(err)
  });

  const myVideo = document.createElement("video");

  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);
    peer.on('call' , (call) => {
      call.answer(stream);
      const video = document.createElement('video');

      call.on('error', (err) => {
        alert(err)
      });

      call.on('stream', (userStream) => {
        addVideoStream(video , userStream);
      });

      call.on('error', (err) => {
        alert(err)
      });
    });
  }).catch((err) => {
    alert(err.message)
  });
});

socket.on('userConnected', (id) => {
  const call  = peer.call(id , myVideoStream);
  const video = document.createElement('video');
  call.on('error', (err) => {
    alert(err);
  });

  call.on('stream' , (userStream) => {
    console.log(userStream);
    addVideoStream(video , userStream);
  });
});