const tf=require('@tensorflow/tfjs');
const loadCSV=require('./load-csv');
let {features,labels,testFeatures,testLabels}=loadCSV('complete.csv',{
    shuffle:true,
    splitTest: 10,
    dataColumns:['Latitude','Longitude'],
    labelColumns:['Total Confirmed cases']
  });
  console.log(testFeatures);
  console.log(testLabels);
  
  
  features=tf.tensor(features);
  labels=tf.tensor(labels);
  //testFeatures=tf.tensor(testFeatures);
  //testLabels=tf.tensor(testLabels);
  
  const result=knn(features,labels, tf.tensor(testFeatures[0]),100);
  console.log(result+ "Guess"+ testLabels[0]);
  //console.log(latitude+" l");
  //console.log(longitude+" o");

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
      .sort((tensorA, tensorB) => tensorA.arraySync() > tensorB.arraySync() ? 1 : -1)
      .slice(0, k)
      .reduce((acc, pair) => acc + pair.arraySync()[1], 0) / k;
}

