
const video = document.getElementById('video');
const button = document.getElementById('button');
const select = document.getElementById('select');
const refresh = document.getElementById('refresh');
//store surrent camera on start camera button to a variable
//check if it's this, if not pick the other one. 
//I think 
let   image = document.querySelector("#snap");
      start_camera = document.querySelector("#start-camera"),
      controls = document.querySelector(".controls"),
      take_photo_btn = document.querySelector("#take-photo"),
      delete_photo_btn = document.querySelector("#delete-photo"),
      //download_photo_btn = document.querySelector("#download-photo"),
      select_cam = document.querySelector("#select-cam"),
      submit_img = document.querySelector("#submit-img"),
      error_message = document.querySelector("#error-message");
let currentStream;

function stopMediaTracks(stream) {
  stream.getTracks().forEach(track => {
    track.stop();
  });
}

function gotDevices(mediaDevices) {
  // select.appendChild(document.createElement('option'));
  let count = 1;
  cameras = []
  //console.log(mediaDevices.length, cam1)
  //if (mediaDevices.length== 2) { cam2 = mediaDevices[1].deviceId; console.log(cam1,cam2)}
  
  mediaDevices.forEach(mediaDevice => {
    if (mediaDevice.kind === 'videoinput') {
      //const option = document.createElement('option');
      //option.value = mediaDevice.deviceId;
      cameras.push(mediaDevice.deviceId)
      //const label = mediaDevice.label || `Camera ${count++}`;
      //const textNode = document.createTextNode(label);
      //option.appendChild(textNode);
      //select.appendChild(option);
    }
  });
  cam1 = cameras[0]
  if(cameras.length == 2) {
    cam2 = cameras[1]
  }

}

button.addEventListener('click', event => {

  button.style.display = "none";
  select_cam.style.display = "inline-block";
  video.style.display = "block";
  take_photo_btn.style.display = "inline-block";
  delete_photo_btn.style.display = "inline-block";
  submit_img.style.display = "inline-block"; 
  if (typeof currentStream !== 'undefined') {
    stopMediaTracks(currentStream);
  }
  const videoConstraints = {};
  /* if (select.value === '') {
    videoConstraints.facingMode = 'user';
  } else {
    videoConstraints.deviceId = { exact: select.value };
  } */
  
    //set the constraints to the first available device 
    //videoConstraints.deviceId = cam1
    videoConstraints.facingMode = 'user';
    currentCam = 'user'
  //console.log(videoConstraints)
  const constraints = {
    video: videoConstraints,
    audio: false
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
      currentStream = stream;
      video.srcObject = stream;
      return navigator.mediaDevices.enumerateDevices();
    })
    .then(gotDevices)
    .catch(error => {
      console.error(error);
    });
});

select_cam.addEventListener('click', event => {
  if (typeof currentStream !== 'undefined') {
    stopMediaTracks(currentStream);
  }
  const videoConstraints = {};
  if (currentCam === 'user') {
    currentCam = "environment"
    videoConstraints.facingMode = 'environment'; 
  } else {
    
    videoConstraints.facingMode = 'user'; 
  } 
  /* if (select.value === 'foobar') {
    videoConstraints.facingMode = 'user';
  } else {
    videoConstraints.deviceId = { exact: select.value };
  } */
  //console.log(videoConstraints)
  const constraints = {
    video: videoConstraints,
    audio: false
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
      currentStream = stream;
      video.srcObject = stream;
      return navigator.mediaDevices.enumerateDevices();
    })
    .then(gotDevices)
    .catch(error => {
      console.error(error);
    });
});
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
submit_img.addEventListener('click', event => {
  //snap is the image uri
  const apiUri = "https://howsmytalk.azurewebsites.net/api/submitPicture"
  //const apiUri = "http://localhost:7071/api/submitPicture"
  const reqBody = {
    "dataURI" : dataURI,
    "speaker" : getParameterByName('speaker')
  }
  axios.post(apiUri, reqBody)
  .then(function (response) {
    //console.log(response);
    //hide the camera after submitting image
    button.style.display = "none";
    select_cam.style.display = "none";
    video.style.display = "none";
    take_photo_btn.style.display = "none";
    delete_photo_btn.style.display = "none";
    submit_img.style.display = "none"; 

    if(response.data.error) {
      document.getElementById("face-error").innerHTML = "OOPS!! " + response.data.error + ". Please hit refresh to try again."
      refresh.style.display = "inline-block";
      return response
    } else {
      //update the elemets to present the reuslts to the user.
    document.getElementById("success").innerHTML = "🤗 Thanks for submitting your feedback! 🤗"
    document.getElementById("emotion").innerHTML = "🙃 Emotion: " + response.data.emotion;
    document.getElementById("age").innerHTML = "🎂 Age: " + response.data.age;
    document.getElementById("gender").innerHTML = "⚥ Gender: " + response.data.gender;
    document.getElementById("glasses").innerHTML = "🤓 Glasses: " + response.data.glasses;
    document.getElementById("facialHair").innerHTML = "🧔🏻 Beard: " + response.data.facialHair;
    document.getElementById("dashboardLink").innerHTML = `📊 Check out the dashboard <a href="https://howsmytalkdashboard.z6.web.core.windows.net/?speaker=${reqBody.speaker}" target="_blank">here</a>! 📈`;
    refresh.style.display = "inline-block";
    return response
    }
    
  })
  .catch(function (error) {
    console.log(error);
  });
});

refresh.addEventListener('click', event => {
  //refresh the page
  window.location.reload()
});

take_photo_btn.addEventListener("click", function(e){

  e.preventDefault();

  var snap = takeSnapshot();

  // Show image. 
  image.setAttribute('src', snap);
  image.classList.add("visible");

  // Enable delete and save buttons
  delete_photo_btn.classList.remove("disabled");
  //download_photo_btn.classList.remove("disabled");

  // Set the href attribute of the download button to the snap url.
  //download_photo_btn.href = snap;

  // Pause video playback of stream.
  video.pause();

});
delete_photo_btn.addEventListener("click", function(e) {
  e.preventDefault();

  // Hide image.
  image.setAttribute("src", "");
  image.classList.remove("visible");

  // Disable delete and save buttons
  delete_photo_btn.classList.add("disabled");

  // Resume playback of stream.
  video.play();
});

function takeSnapshot(){
  // Here we're using a trick that involves a hidden canvas element.  

  var hidden_canvas = document.querySelector('canvas'),
      context = hidden_canvas.getContext('2d');

  var width = video.videoWidth,
      height = video.videoHeight;

  if (width && height) {

    // Setup a canvas with the same dimensions as the video.
    hidden_canvas.width = width;
    hidden_canvas.height = height;

    // Make a copy of the current frame in the video on the canvas.
    context.drawImage(video, 0, 0, width, height);

    // Turn the canvas image into a dataURL that can be used as a src for our photo.
    dataURI = hidden_canvas.toDataURL('image/png');
    //console.log(dataURI)
    return hidden_canvas.toDataURL('image/png');
  }
}

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  //console.log(dataURI)
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;

}

navigator.mediaDevices.enumerateDevices().then(gotDevices);
