/**
 * Moves the map to display over Berlin
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */


 
var lati=new Array();
var longi=new Array();


function addMarkersToMap(map) {
  

  for(var i=0;i<lati.length;i=i+1)
  {
    var parisMarker = new H.map.Marker({lat:lati[i], lng:longi[i]});
    map.addObject(parisMarker);
  }

}

function moveMapToBerlin(map){
  map.setCenter({lat:12.972442, lng:77.580643});
  map.setZoom(14);
}


function setUpClickListener(map) {
  // Attach an event listener to map display
  // obtain the coordinates and display in an alert box.
  map.addEventListener('tap', function (evt) {
    var coord = map.screenToGeo(evt.currentPointer.viewportX,
            evt.currentPointer.viewportY);
    logEvent('Clicked at ' + Math.abs(coord.lat.toFixed(4)) +
        ((coord.lat > 0) ? 'N' : 'S') +
        ' ' + Math.abs(coord.lng.toFixed(4)) +
         ((coord.lng > 0) ? 'E' : 'W'));
         lati.push(coord.lat.toFixed(4));
         longi.push(coord.lng.toFixed(4));
         console.log(coord.lat.toFixed(4)+" "+coord.lng.toFixed(4));
         console.log(lati);

         // change
         show();
         
         addMarkersToMap(map);
        //  module.exports = { variableName: "lati" };    
  });
}




/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: 'ltV5uwSWWnCsM1AbSv92aSfNKtNZ6a-GCtIiJ-6-d_0'
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - this map is centered over Europe
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat:12.972442, lng:77.580643},
  zoom: 4,
  pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());



// Create the default UI components
 


var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

var ui = H.ui.UI.createDefault(map, defaultLayers);

// Now use the map as required...
window.onload = function () {
  moveMapToBerlin(map);
  
}  

// Step 4: create custom logging facilities
var logContainer = document.createElement('ul');
logContainer.className ='log';
map.getElement().appendChild(logContainer);
function logEvent(str) {
  var entry = document.createElement('li');
  entry.className = 'log-entry';
  entry.textContent = str;
  logContainer.insertBefore(entry, logContainer.firstChild);
}

setUpClickListener(map); 

var platform = new H.service.Platform({
  'apikey': 'ltV5uwSWWnCsM1AbSv92aSfNKtNZ6a-GCtIiJ-6-d_0'
});

// Get an instance of the geocoding service:
var service = platform.getSearchService();

// Call the geocode method with the geocoding parameters,
// the callback and an error callback function (called if a
// communication error occurs):
service.geocode({
  q: 'Krishna Nagar, Lucknow, India'
}, (result) => {
  // Add a marker for each location found
  result.items.forEach((item) => {
    map.addObject(new H.map.Marker(item.position));
  });
}, alert);

/////change 
function show(){
  document.getElementById("result").value = lati+","+longi;
}