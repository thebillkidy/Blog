var video = document.querySelector("#webcam");
var vidStream;

var startBtn = document.getElementById('btnStart');
startBtn.onclick = () => {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
 
    if (navigator.getUserMedia) {       
        navigator.getUserMedia({video: true}, handleVideo, videoError);
    }
}

var sampleBtn = document.getElementById('btnSample');
sampleBtn.onclick = () => {
    document.getElementById('tempImg').src = window.getScreenshot(document.getElementById("webcam")).src;
    
    window.getScreenshotBlob(document.getElementById("webcam"), (blob) => {
        window.callApi(blob);
    });
}

var stopBtn = document.getElementById('btnStop');
stopBtn.onclick = () => {
    clearInterval(window.pictureInterval);
    video.src = null;
    document.getElementById('tempImg').src = null;
    vidStream.stop();
}

 
function handleVideo(stream) {
    vidStream = stream;
    video.src = window.URL.createObjectURL(stream);
}
 
function videoError(e) {
    // do something
}

/**
* Takes a screenshot from video.
* @param videoEl {Element} Video element
* @param scale {Number} Screenshot scale (default = 1)
* @returns {Element} Screenshot image element
*/
window.getScreenshot = function (videoEl, scale) {
   scale = scale || 1;

   const canvas = document.createElement("canvas");
   canvas.width = videoEl.clientWidth * scale;
   canvas.height = videoEl.clientHeight * scale;
   canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height);

   const image = new Image()
   image.src = canvas.toDataURL();
   return image;
}

window.getScreenshotBlob = function (videoEl, cb) {
  scale = 1;

  const canvas = document.createElement("canvas");
  canvas.width = videoEl.clientWidth * scale;
  canvas.height = videoEl.clientHeight * scale;
  canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height);

  return canvas.toBlob((blob) => cb(blob));
}