// Use this link to get the geojson data.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Function to populate plate to the plates layer
function getPlates(plates) {
   // Read the data from PB2002_plates.json file
   d3.json("static/PB2002_plates.json", function(plateData) {
      // Add various plate data to the plates layer
      L.geoJSON(plateData, {
                color: "orange",
                weight: 2
                }).addTo(plates);
    }
    )}

// Create various maps
function createMap(earthquakes,plates) {
  
    //<!-- See a list of Mapbox-hosted public styles at -->
    //<!-- https://docs.mapbox.com/api/maps/styles/#mapbox-styles -->

    // Define satellite, grayscale and Street map layers
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });

    var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
  
    var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Satellite": satellitemap,
      "Grayscale": grayscalemap,
      "Outdoors": outdoorsmap
    };            

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes,
      FaultLines: plates
    };
      
  // Create our map, giving it the satellitemap, earthquakes and plates layers to display on load
   var myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 3,
    layers: [satellitemap, earthquakes, plates] 
  }); 


  
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

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
}



// Define a markerSize function that will give each location a different radius based on its magnitude
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


function onEachLayer(feature) {
  return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
    radius: circleSize(feature.properties.mag),
    fillOpacity: 0.8,
    color: getColor(feature.properties.mag),
    fillColor: getColor(feature.properties.mag)
  });
}


// This will be run when L.geoJSON creates the point layer from the GeoJSON data.
function createCircleMarker(feature){
  
  // Change the values of these options to change the symbol's appearance
  var options = {
    radius: markerSize(feature.properties.mag),
    // Decide the color from the magnitube
    fillColor: getColor(feature.properties.mag),
    color: getColor(feature.properties.mag),
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }

  // Add marker to map
  return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], options );
}


// Perform a GET request to the query URL
d3.json(url, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  function onEachFeature(feature, layer) {
    // Give each feature a popup describing the place, magnitude and time of the earthquake
    var markerInfo = 'Location: ' + feature.properties.place + '<br>' + 'Magnitude: ' + feature.properties.mag + '<br>' + Date(feature.properties.time);
    layer.bindPopup(markerInfo);
  }

  // Create the plates layer for the map
  var plates = new L.LayerGroup();
  // Update plates layer with PB2002_plates.json file
  getPlates(plates);

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });

  
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes,plates);
}

