window.onload = async function() {
  let timestamp = new Date();
  timestamp.setUTCHours(0, 0, 0, 0);
  let longDate = +timestamp;
  let newDate = longDate / 1000;
  let date = newDate.toString();
  const apiUri = "https://howsmytalk.azurewebsites.net/api/getFaceData";
  const speaker = getParameterByName('speaker')

  const reqBody = {
    date: date,
    speaker: speaker
  };
  console.log(reqBody)
  axios
    .post(apiUri, reqBody)
    .then(function(response) {
     // console.log(response)
      createEmotionChart(response);
      createGenderChart(response);
      createGlassesChart(response);
      createFacialHairChart(response)
      createAgeValues(response);
      createTotalValue(response)
      return response;
    })
    .catch(function(error) {
      console.log(error);
      return error;
    });
};

createAgeValues = function(response) {
  let age = Math.round((response.data.age) * 100) / 100 ;
  //console.log(age)
  
  document.getElementById("age").innerHTML =
    "👫 Average: " + age;
  document.getElementById("minAge").innerHTML = "👶 Youngest: " + response.data.minAge;
  document.getElementById("maxAge").innerHTML =
    "👵 Oldest: " + response.data.maxAge;
};
createTotalValue = function(response) {
  document.getElementById("totalResponses").innerHTML = response.data.totalResponses;
};
createEmotionChart = function(response) {
  //calculate percentages
  let emotion = response.data.emotion;
  let emotionTotal =
    emotion.happiness +
    emotion.sadness +
    emotion.anger +
    emotion.surprise +
    emotion.contempt +
    emotion.disgust +
    emotion.neutral +
    emotion.fear;
  let perc = 100 / emotionTotal;

  var emotionChartValues = [
    {
      y: Math.round((response.data.emotion.happiness * perc) * 100) / 100 ,
      name: "Happiness 😄",
      color: "#98df8a" //"#1f77b4"
    },
    {
      y: Math.round((response.data.emotion.sadness * perc) * 100) / 100 ,
      name: "Sadness 😥",
      color: "#1f77b4" //"#ff7f0e"
    },
    {
      y:  Math.round((response.data.emotion.anger * perc) * 100) / 100 ,
      name: "Anger 😡",
      color: "#d62728" //"#ffbb78"
    },
    {
      y:  Math.round((response.data.emotion.surprise * perc) * 100) / 100 ,
      name: "Suprise 😲",
      color: "#ffbb78"
    },
    {
      y:  Math.round((response.data.emotion.contempt * perc) * 100) / 100 ,
      name: "Contempt 🙄",
      color: "#800080"
    },
    {
      y:  Math.round((response.data.emotion.disgust * perc) * 100) / 100 ,
      name: "Disgust 🤢",
      color: "#bcbd22"
    },
    {
      y:  Math.round((response.data.emotion.neutral * perc) * 100) / 100 ,
      name: "Neutral 😐",
      color: "#f7b6d2"
    },
    {
      y:  Math.round((response.data.emotion.fear * perc) * 100) / 100 ,
      name: "Fear 😱",
      color: "#ff7f0e"
    }
  ];
  renderEmotionChart(emotionChartValues);

  function renderEmotionChart(values) {
    var chart = new CanvasJS.Chart("emotionChart", {
      backgroundColor: "white",
      colorSet: "colorSet2",
      type: "pie",
      title: {
        text: "Emotion 🙃",
        fontFamily: "Bangers",
        fontSize: 25,
        fontWeight: "normal",
        fontColor: "#3399ff"
      },
      animationEnabled: true,
      data: [
        {
          indexLabelFontSize: 15,
          indexLabelFontFamily: "Monospace",
          indexLabelFontColor: "darkgrey",
          indexLabelLineColor: "darkgrey",
          indexLabelPlacement: "outside",
          indexLabelFormatter: function(e) {
            if (e.dataPoint.y === 0)
              return "";
            else
              return e.dataPoint.name + " | " + e.dataPoint.y + "%";//"{name} | {y}%";
          },
          //indexLabel: "{name} | {y}%",
          type: "pie",
          showInLegend: false,
          toolTipContent: "<strong>#percent%</strong>",
          dataPoints: values
        }
      ]
    });
    chart.render();
  }
};

createGenderChart = function(response) {
  //calculate percentages
  let gender = response.data.gender;
  let genderTotal = gender.male + gender.female;
  let perc = 100 / genderTotal;

  var genderChartValues = [
    {
      y:  Math.round((response.data.gender.male * perc) * 100) / 100 ,
      name: "Male ♂️",
      color: "#98df8a"
    },
    {
      y: Math.round((response.data.gender.female * perc) * 100) / 100 ,
      name: "Female ♀️",
      color: "#ffbb78"
    }
  ];
  renderGenderChart(genderChartValues);

  function renderGenderChart(values) {
    var chart = new CanvasJS.Chart("genderChart", {
      backgroundColor: "white",
      colorSet: "colorSet2",
      type: "pie",
      title: {
        text: "Gender ⚥",
        fontFamily: "Bangers",
        fontSize: 25,
        fontWeight: "normal",
        fontColor: "#3399ff"
      },
      animationEnabled: true,
      data: [
        {
          indexLabelFontSize: 15,
          indexLabelFontFamily: "Monospace",
          indexLabelFontColor: "darkgrey",
          indexLabelLineColor: "darkgrey",
          indexLabelPlacement: "outside",
          indexLabelFormatter: function(e) {
            if (e.dataPoint.y === 0)
              return "";
            else
              return e.dataPoint.name + " | " + e.dataPoint.y + "%";//"{name} | {y}%";
          },
          indexLabel: "{name} | {y}%",
          type: "pie",
          showInLegend: false,
          toolTipContent: "<strong>#percent%</strong>",
          dataPoints: values
        }
      ]
    });
    chart.render();
  }
};

createGlassesChart = function(response) {
  //calculate percentages
  let glasses = response.data.glasses;
  let glassesTotal = glasses.true + glasses.false;
  let perc = 100 / glassesTotal;

  var glassesChartValues = [
    {
      y: Math.round((response.data.glasses.true * perc) * 100) / 100 ,
      name: "True 🤓",
      color: "#98df8a" //"#1f77b4"
    },
    {
      y: Math.round((response.data.glasses.false * perc) * 100) / 100 ,
      name: "False 😊",
      color: "#1f77b4" //"#ff7f0e"
    }
  ];
  renderGlassesChart(glassesChartValues);

  function renderGlassesChart(values) {
    var chart = new CanvasJS.Chart("glassesChart", {
      backgroundColor: "white",
      colorSet: "colorSet2",
      type: "pie",
      title: {
        text: "Glasses 🤓",
        fontFamily: "Bangers",
        fontSize: 25,
        fontWeight: "normal",
        fontColor: "#3399ff"
      },
      animationEnabled: true,
      data: [
        {
          indexLabelFontSize: 15,
          indexLabelFontFamily: "Monospace",
          indexLabelFontColor: "darkgrey",
          indexLabelLineColor: "darkgrey",
          indexLabelPlacement: "outside",
          indexLabelFormatter: function(e) {
            if (e.dataPoint.y === 0)
              return "";
            else
              return e.dataPoint.name + " | " + e.dataPoint.y + "%";//"{name} | {y}%";
          },
          indexLabel: "{name} | {y}%",
          type: "pie",
          showInLegend: false,
          toolTipContent: "<strong>#percent%</strong>",
          dataPoints: values
        }
      ]
    });
    chart.render();
  }
};

createFacialHairChart = function(response) {
  //calculate percentages
  let facialHair = response.data.facialHair;
  let facialHairTotal = facialHair.true + facialHair.false;
  let perc = 100 / facialHairTotal;

  var facialHairChartValues = [
    {
      y: Math.round((response.data.facialHair.true * perc) * 100) / 100 ,
      name: "True 🧔🏻",
      color: "#98df8a" //"#1f77b4"
    },
    {
      y: Math.round((response.data.facialHair.false * perc) * 100) / 100 ,
      name: "False 👨",
      color: "#1f77b4" //"#ff7f0e"
    }
  ];
  renderFacialHairChart(facialHairChartValues);

  function renderFacialHairChart(values) {
    var chart = new CanvasJS.Chart("facialHairChart", {
      backgroundColor: "white",
      colorSet: "colorSet2",
      type: "pie",
      title: {
        text: "Beard 🧔🏻",
        fontFamily: "Bangers",
        fontSize: 25,
        fontWeight: "normal",
        fontColor: "#3399ff"
      },
      animationEnabled: true,
      data: [
        {
          indexLabelFontSize: 15,
          indexLabelFontFamily: "Monospace",
          indexLabelFontColor: "darkgrey",
          indexLabelLineColor: "darkgrey",
          indexLabelPlacement: "outside",
          indexLabelFormatter: function(e) {
            if (e.dataPoint.y === 0)
              return "";
            else
              return e.dataPoint.name + " | " + e.dataPoint.y + "%";//"{name} | {y}%";
          },
          indexLabel: "{name} | {y}%",
          type: "pie",
          showInLegend: false,
          toolTipContent: "<strong>#percent%</strong>",
          dataPoints: values
        }
      ]
    });
    chart.render();
  }
};
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}