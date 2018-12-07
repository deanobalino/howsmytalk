const axios = require('axios');
const fs = require ('fs');
const uuidv4 = require('uuid/v4');

doStuff()

async function doStuff(){

    const faceAPIUri = "https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=emotion"
    let imageUuid = uuidv4();
    let imagePath = __dirname + '1543929247845.jpg';
    let image = fs.readFileSync(imagePath)
    const result = await getFaceData(faceAPIUri,image)
    return result
}

function getFaceData(faceAPIUri,image) {

    let headers = {
        'Content-Type' : 'application/octet-stream',
        'Ocp-Apim-Subscription-Key' : 'fbe468a81bf6490ab50febcee94db33c'
    }
    let faceData = axios.post(faceAPIUri, image, {headers : headers}).then(function (response) {
        //let responseData = JSON.parse(response.data[0])
        console.log('Emotion :', response.data[0].faceAttributes.emotion)
        return response
      })
      .catch(function (error) {
        console.log("There was an error", error);
      });
    

}

function base64ImageToBlob(image64,path) {
    let base64Image = image64.split(';base64,').pop();
    
    fs.writeFileSync(path, base64Image, {encoding: 'base64'}, function(err) {
    });
    console.log('created file in memory of image')
  }
//Determine the emotion detected

//Add to a counter in CosmosDB

//send text to text api

//extract key words

//Add to keywords array for date in cosmosDB

