module.exports = async function(context, req) {
  var documents = context.bindings.faceDocuments;
  //context.log("Face Documents Length: ", documents.length);

  ageArray = [];
  results = {
    emotion: {
      anger: 0,
      contempt: 0,
      disgust: 0,
      fear: 0,
      happiness: 0,
      neutral: 0,
      sadness: 0,
      surprise: 0
    },
    glasses: {
      true: 0,
      false: 0
    },
    facialHair: {
      true:0,
      false: 0
    },
    gender: {
      male: 0,
      female: 0
    },
    age: 0,
    maxAge: 0,
    minAge: 0,
    totalResponses: 0 
  };

  if (documents.length === 0) {
    context.res = {
      status: 404,
      body: "No documents found"
    };
  } else {
    for (var i = 0; i < documents.length; i++) {
      var faceDocument = documents[i];
      context.log("Document ", i + 1, ": ", faceDocument.emotion);
      // operate on each document
      results.emotion[faceDocument.emotion] =
        results.emotion[faceDocument.emotion] + 1;
        results.facialHair[faceDocument.facialHair] =
        results.facialHair[faceDocument.facialHair] + 1;
      results.glasses[faceDocument.glasses] =
        results.glasses[faceDocument.glasses] + 1;
      results.gender[faceDocument.gender] =
        results.gender[faceDocument.gender] + 1;
        results.totalResponses =
        results.totalResponses + 1;
      ageArray.push(faceDocument.age);
      console.log(results.emotion);
    }
    console.log(ageArray)
    var ageTotal = 0;
    for (var i = 0; i < ageArray.length; i++) {
      ageTotal += ageArray[i];
    }
    var avg = ageTotal / ageArray.length;
    results.age = avg;
    results.maxAge = Math.max.apply(null, ageArray)
    results.minAge = Math.min.apply(null, ageArray)

    context.res = {
      status: 200,
      body: results
    };
  }
  return results;
  //context.done();
};
