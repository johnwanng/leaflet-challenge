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
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
  
  // Define a markerSize function that will give each city a different radius based on its magnitude
  function markerSize(magnitude) {
        return magnitude * 1500/600;
  }



/* 
 * Create a circle symbol to use with a GeoJSON layer instead of the default blue marker
 */

// This will be run when L.geoJSON creates the point layer from the GeoJSON data.
function createCircleMarker( feature, latlng ){
  console.log(feature.properties.mag);
  // Change the values of these options to change the symbol's appearance
  var options = {
    radius: markerSize(feature.properties.mag),
    fillColor: "lightgreen",
    color: "black",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }
  var markerInfo = 'Location: ' + feature.properties.place + '<br>' + 'Magnitude: ' + feature.properties.mag;
  return L.circleMarker( latlng, options ).addTo(myMap).bindPopup(markerInfo);
}


  // Grabbing our GeoJSON data..
  d3.json(url, function(data) {
    // Creating a GeoJSON layer with the retrieved data

    L.geoJSON( data, {
      pointToLayer: createCircleMarker // Call the function createCircleMarker to create the symbol for this layer
    }).addTo( myMap )
    //L.geoJson(data).addTo(myMap);
    
    //console.log(data.metadata.title);
    //console.log(data);
    //createCircle(data.features);

  });