/**
 * Pass an emotions object containing: 
 * anger: 0
​ * contempt: 0
​​​​ * disgust: 0
​​​​ * fear: 0
​​​​ * happiness: 1
​​​​ * neutral: 0
​​​​ * sadness: 0
​​​​ * surprise: 0
 * @param {*} emotions 
 */
function setEmotions(emotions) {
  console.log(emotions);
  window.happy = emotions.happiness;
  window.angry = emotions.anger;
  window.worried = emotions.fear;
  window.mouthopen = emotions.surprise;

  var happy = document.getElementById("happy");
  var angry = document.getElementById("angry");
  var worried = document.getElementById("worried");
  var mouthopen = document.getElementById("mouthopen");

  happy.value = window.happy;
  angry.value = window.angry;
  worried.value = window.worried;
  mouthopen.value = window.mouthopen;

  // Fake call input event
  var event = document.createEvent('Event');
  event.initEvent('input', true, true);
  happy.dispatchEvent(event);
  angry.dispatchEvent(event);
  worried.dispatchEvent(event);
  mouthopen.dispatchEvent(event);
}


window.callApi = function (imgBlob) {
  const key = 'e1be69918f1b42a3bec6c58d91b5c467';
  const endpoint = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';
  const params = "?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise";
  // const params = "?visualFeatures=Categories";

  
  fetch(endpoint + params, {
    method: 'POST',
    body: imgBlob,
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/octet-stream'
    }
  })
  .then((res) => res.json())
  .then((json) => {
    const emotions = json[0].faceAttributes.emotion;
    setEmotions(emotions);
  });

}