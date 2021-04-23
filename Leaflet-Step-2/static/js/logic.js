// Creating map object
var myMap = L.map("map", {
  center: [40.7128, -74.0059],
  zoom: 3
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Use this link to get the geojson data.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define a markerSize function that will give each city a different radius based on its magnitude
function markerSize(magnitude) {
      return magnitude * 1500/600;
}



/* 
* Create a circle symbol to use with a GeoJSON layer instead of the default blue marker
*/


/* function getColor(d) {
return d > 5.7 ? '#800026' :
       d > 5.5   ? '#BD0026' :
       d > 5.3  ? '#E31A1C' :
       d > 5.1  ? '#FC4E2A' :
       d > 4.9   ? '#FD8D3C' :
       d > 4.7   ? '#FEB24C' :
       d > 4.5   ? '#FED976' :
                  '#FFEDA0';
}
*/


function getColor(d) {
return d > 10 ? '#800026' :
       d > 5  ? '#BD0026' :
       d > 4  ? '#E31A1C' :
       d > 3  ? '#FC4E2A' :
       d > 2  ? '#FD8D3C' :
       d > 1  ? '#FEB24C' :
                '#FED976';
                //'#FFEDA0';
}
// This will be run when L.geoJSON creates the point layer from the GeoJSON data.
function createCircleMarker( feature, latlng ){
//console.log(feature.properties.mag);
//if (feature.properties.mag <= 5) {colour = "Yellow"}
colour = getColor(feature.properties.mag)
/* if (feature.properties.mag <= 4.6) {colour = "#f0fc03"}
else if (feature.properties.mag <= 4.8) {colour = "#fcf803"}
else if (feature.properties.mag <= 5) {colour = "#fceb03"}
else if (feature.properties.mag <= 5.2) {colour = "#fce303"}
else if (feature.properties.mag <= 5.4) {colour = "#fcdb03"}
else if (feature.properties.mag <= 5.6) {colour = "#fcc603"}
else if (feature.properties.mag <= 5.8) {colour = "#fcb103"}
else if (feature.properties.mag <= 6) {colour = "#fc9003"}
else if (feature.properties.mag <= 6.2) {colour = "#fc6b03"}
else if (feature.properties.mag <= 6.4) {colour = "#fc4a03"} */

// Change the values of these options to change the symbol's appearance
var options = {
  radius: markerSize(feature.properties.mag),
  fillColor: colour,
  color: "black",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
}

var markerInfo = 'Location: ' + feature.properties.place + '<br>' + 'Magnitude: ' + feature.properties.mag;

return L.circleMarker( latlng, options ).addTo(myMap).bindPopup(markerInfo);
//}
}


// Grabbing our GeoJSON data..
d3.json(url, function(data) {
  // Creating a GeoJSON layer with the retrieved data

  L.geoJSON( data, {
    pointToLayer: createCircleMarker // Call the function createCircleMarker to create the symbol for this layer
  }).addTo( myMap )



var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
          magnitude = [0, 1, 2, 3, 4, 5],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < magnitude.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(magnitude[i] + 1) + '"></i> ' +
              magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
      }
      return div;
  };
  legend.addTo(myMap);
});