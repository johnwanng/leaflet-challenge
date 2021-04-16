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
  
  // Define a markerSize function that will give each city a different radius based on its population
    function markerSize(population) {
        return population / 40;
  }
  

  // Grabbing our GeoJSON data..
  d3.json(url, function(data) {
    // Creating a GeoJSON layer with the retrieved data
    //L.geoJson(data).addTo(myMap);
    L.circle(data[i].location, {
        fillOpacity: 0.75,
        color: "white",
        fillColor: "purple",
        // Setting our circle's radius equal to the output of our markerSize function
        // This will make our marker's size proportionate to its population
        radius: markerSize(data[i].population)
      }).bindPopup("<h1>" + data[i].name + "</h1> <hr> <h3>Population: " + data[i].population + "</h3>").addTo(myMap);
    
    console.log(data.metadata.title);
  });