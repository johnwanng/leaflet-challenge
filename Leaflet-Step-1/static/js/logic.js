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

// Get color for magnitude
function getColor(d) {
  return d > 5 ? '#800026' :
        d > 4  ? '#BD0026' :
        d > 3  ? '#E31A1C' :
        d > 2  ? '#FC4E2A' :
        d > 1  ? '#FD8D3C' :
                  '#FEB24C';
}
// This will be run when L.geoJSON creates the point layer from the GeoJSON data.
function createCircleMarker( feature, latlng ){
  
  // Decide the color from the magnitube
  colour = getColor(feature.properties.mag)

  // Change the values of these options to change the symbol's appearance
  var options = {
    radius: markerSize(feature.properties.mag),
    fillColor: colour,
    color: colour,
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }

  // Prepare mark info for the earthquake location
  var markerInfo = 'Location: ' + feature.properties.place + '<br>' + 'Magnitude: ' + feature.properties.mag + '<br>' + Date(feature.properties.time);
  // Add marker to map
  return L.circleMarker( latlng, options ).addTo(myMap).bindPopup(markerInfo);
}


// Grabbing our GeoJSON data..
d3.json(url, function(data) {
  
  // Creating a GeoJSON layer with the retrieved data
  L.geoJSON( data, {
    pointToLayer: createCircleMarker // Call the function createCircleMarker to create the symbol for this layer
  }).addTo( myMap )

  // Define the legend 
  var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5];
    
        // loop through our magnitude intervals and generate a label with a colored square for each interval
        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }
        return div;
    };
    //Add Legend to map 
    legend.addTo(myMap);
});