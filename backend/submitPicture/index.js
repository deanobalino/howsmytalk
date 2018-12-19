const axios = require('axios').default;
const fs = require ('fs');
const uuidv4 = require('uuid/v4');

module.exports = async function (context, req, res) {
    context.log('JavaScript HTTP trigger function processed a request.');

    //Setup
    let timestamp = new Date();
    timestamp.setUTCHours(0,0,0,0);
    let longDate = +timestamp
    let newDate = longDate / 1000
    let date = newDate.toString();
    context.log(date)
    const faceAPIUri = "https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=emotion,age,gender,glasses,facialHair"
    const textAPIUri = ""
    const image64 = req.body.dataURI
    const speaker = req.body.speaker
    const imageUuid = uuidv4();
    const path = "D:/local/Temp/" + date +'.jpeg';
    //const path = __dirname + date + '.jpeg'
    console.log("path: ", path)
    //console.log(path)
    //send image to the Face API
    console.log("converting image from b64 to blob")
    await base64ImageToBlob(image64,path)
    console.log('sending image to face API')
    const faceData = await getFaceData(faceAPIUri, path)
    console.log('processing Face API Response')
    const results = await processData(faceData)
    const cosmosResponse = await addToCosmos(results, imageUuid, date, context, speaker)
    //const textData = await getTextData(textAPIUri)
    //const addRecord = await sendToMongo(faceData, textData)
    context.res = {
        "status" : 200,
        "body" : results
    }
    //console.log("faceData: ", "")
    return cosmosResponse
};

function addToCosmos(results, imageUuid, date, context, speaker) {
    // write to cosmos with today's date and a UUID as the key.
    context.bindings.faceDocument = JSON.stringify({
        date: date,
        speaker : speaker,
        id : imageUuid,
        emotion: results.emotion,
        age: results.age,
        gender: results.gender,
        glasses: results.glasses,
        facialHair: results.facialHair,
        error: results.error
      });
      return { "status" : 200,
      "body" : results }
}
function processData(faceResponse){
    //console.log("faceData: ", faceData.faceAttributes.emotion)
    if(!faceResponse.faceAttributes) {
        faceInsights = {
            "emotion" : null,
            "age" : null,
            "gender" : null,
            "glasses" : null,
            "facialHair" : null,
            "error" : "Unable to identify a face"
        }
        console.log(faceInsights.error)
        return(faceInsights)
    } else {
    faceResponseEmotion = faceResponse.faceAttributes.emotion;
    highestVal = Math.max.apply(null, Object.values(faceResponseEmotion)),
    val = Object.keys(faceResponseEmotion).find(function(a) {
    return faceResponseEmotion[a] === highestVal;
    });
    
    ('processdata func: ' , faceResponse.faceAttributes)
    if (faceResponse.faceAttributes.glasses === "NoGlasses"){
        glasses = false
    } else {
        glasses = true
    } 
    if (faceResponse.faceAttributes.facialHair.beard > 0.7) {facialHair = true} 
    else { facialHair = false}
    console.log(facialHair)
    let faceInsights = {
        "emotion" : val,
        "age" : faceResponse.faceAttributes.age,
        "gender" : faceResponse.faceAttributes.gender,
        "glasses" : glasses,
        "facialHair" : facialHair
    }
    console.log(faceInsights);
    
    return(faceInsights)
    }
    
}
function base64ImageToBlob(image64,path) {
    let base64Image = image64.split(';base64,').pop();
    
    fs.writeFileSync(path, base64Image, {encoding: 'base64'}, function(err) {
    });
    //console.log("{'fileWriteStatus' : 'success'}")
    return {"fileWriteStatus": "success"}
}
async function getFaceData(faceAPIUri, path){    
    let headers = {
        'Content-Type' : 'application/octet-stream',
        'Ocp-Apim-Subscription-Key' : process.env.FACE_API_KEY
    }
    let image = fs.readFileSync(path)
    const faceApiResponse = await axios.post(faceAPIUri, image, {headers : headers}).then(function (response) {
        console.log(response)
        console.log('Emotion :', response.data[0].faceAttributes)
        return response.data[0]
      })
      .catch(function (error) {
        console.log("There was an error", error);
        return {'faceApiStatus' : 'Error'}
      });
    return faceApiResponse
}


