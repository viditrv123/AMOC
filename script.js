const fs=require('fs');
const http=require('http');
const express=require('express');
const bodyParser = require("body-parser");
const app=express();
app.use(express.static("public"));
app.set("view engine", "ejs");
const request = require('request');

app.use(bodyParser.urlencoded({
  extended: true
}));

const tf=require('@tensorflow/tfjs');
const loadCSV=require('./load-csv');



var result=new Array();

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/about",(req,res)=>{
    res.render("about");
});

app.get("/codes",(req,res)=>{
    res.render("codes");
});

app.get("/contact",(req,res)=>{
    res.render("contact");
});
app.get("/hospital",(req,res)=>{
  res.render("hospital");
});
var xx,yy;
app.post("/hospital",(req,res)=>{
  
  xx=req.body.result;
  yy=xx.substring(xx.indexOf(",")+1);
  xx=xx.substring(0,xx.indexOf(","));



  res.redirect("/nearHospitals")
})
var o;
app.get("/nearHospitals",(req,res)=>{
  var a,b;
  a=xx;
  b=yy;
  
  
  request("https://places.ls.hereapi.com/places/v1/discover/explore?at="+a+"%2C"+b+"&cat=hospital-health-care-facility&apiKey=ltV5uwSWWnCsM1AbSv92aSfNKtNZ6a-GCtIiJ-6-d_0", function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // Print the HTML for the Google homepage.
  var data=JSON.parse(body);
  var name=data.results.items;
  console.log(name[0].position[0]);
  o=name;
  JSON.stringify(o);
  console.log(o);
  
  
});
  res.render("nearHospitals",{nn:o});
});

app.get("/gallery",(req,res)=>{
    res.render("gallery");
});

app.get("/icons",(req,res)=>{
    res.render("icons");
});

app.get("/map",(req,res)=>{
    // console.log(window.lati);
    

    res.render("map");
    

});
var latitude=new Array();
var longitude=new Array();
var srft_lot=new Array();
app.post("/map",(req,res)=>{
  var a=req.body.result;
  console.log(a);
  var b=a.split(",");
  console.log(b);
  longitude=new Array();
  latitude=new Array();
  for(var i=0;i<b.length;i=i+1)
  {
    if(i<b.length/2)
    latitude.push(Number(b[i]));
    else
    longitude.push(Number(b[i]));
    srft_lot.push(Number(req.body.sqft))

  }
  //console.log(latitude+" "+longitude);

  let {features,labels,testFeatures,testLabels}=loadCSV('complete.csv',{
    shuffle:true,
    splitTest: 10,
    dataColumns:['Latitude','Longitude'],
    labelColumns:['Total Confirmed cases']
  });
  //console.log(testFeatures);
  //console.log(testLabels);
  
  
  features=tf.tensor(features);
  labels=tf.tensor(labels);
  //testFeatures=tf.tensor(testFeatures);
  //testLabels=tf.tensor(testLabels);
  for(var i=0;i<latitude.length;i=i+1){
  result[i]=knn(features,labels, tf.tensor([latitude[i],longitude[i]]),25);
  console.log(result);

  }
  //console.log(latitude+" l");
  //console.log(longitude+" o");
  
  
  res.redirect("/map2");
  
});

function knn(features, labels, predictionPoint, k){
  const {mean,variance}=tf.moments(features,0);
  const scaledPrediction=predictionPoint.sub(mean).div(variance.pow(.5));
  return features
      .sub(mean)
      .div(variance.pow(.5))
      .sub(scaledPrediction)
      .pow(2)
      .sum(1)
      .pow(0.5)
      .expandDims(1)
      .concat(labels, 1)
      .unstack()
      .sort((tensorA, tensorB) => tensorA.arraySync()[0] > tensorB.arraySync()[0] ? 1 : -1)
      .slice(0, k)
      .reduce((acc, pair) => acc + pair.arraySync()[1], 0) / k;
}





app.get("/map2",(req,res)=>{
  // console.log(window.lati);
  latitude.map(String);
  longitude.map(String);
  res.render("map2",{res:result});
  

});


app.listen("3000",()=>{
    console.log("Listening on port 3000");
    
});