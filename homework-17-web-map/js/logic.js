 var url = [{
         earthquake: 'Significant Earthquakes',
         url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'
     },
     {
         earthquake: 'M4.5+ Earthquakes',
         url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson'
     }
 ]

 // Perform a GET request to the query URL
 var overlayMaps = {}
 d3.json(url[0].url, function(data) {
     // Once we get a response, send the data.features object to the createFeatures function
     var earth = createFeatures(data.features);
     overlayMaps[url[0].earthquake] = earth;
     //return earth;
     d3.json(url[1].url, function(data) {
         var earth2 = createFeatures(data.features);
         overlayMaps[url[1].earthquake] = earth2;
         createMap(overlayMaps);
     });
 });

 function getColor(d) {
     return d > 800 ? '#800026' :
         d > 600 ? '#E31A1C' :
         d > 500 ? '#FC4E2A' :
         d > 400 ? '#FD8D3C' :
         d > 300 ? '#FEB24C' :
         d > 100 ? '#FED976' :
         '#FFEDA0';
 }

 function createFeatures(earthquakeData) {
     // Define a function we want to run once for each feature in the features array
     // Give each feature a popup describing the place and time of the earthquake
     function onEachFeature(feature, layer) {
         layer.bindPopup("<h3>" + feature.properties.place +
             "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
     }

     function circleMarker(feature, layer) {
         return L.circleMarker(layer, {
             radius: feature.properties.sig / 70,
             fillColor: getColor(feature.properties.sig),
             color: "#000",
             weight: 1,
             opacity: 1,
             fillOpacity: 0.8
         });
     }
     // Create a GeoJSON layer containing the features array on the earthquakeData object
     // Run the onEachFeature function once for each piece of data in the array
     var earthquakes = L.geoJSON(earthquakeData, {
         onEachFeature: onEachFeature,
         pointToLayer: circleMarker
     });

     // Sending our earthquakes layer to the createMap function
     return earthquakes;
 }

 function createMap(overlayMaps) {

     // Define streetmap and darkmap layers
     var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
         maxZoom: 18,
         id: "mapbox.streets",
         accessToken: API_KEY
     });

     var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
         maxZoom: 18,
         id: "mapbox.dark",
         accessToken: API_KEY
     });

     // Define a baseMaps object to hold our base layers
     var baseMaps = {
         "Street Map": streetmap,
         "Dark Map": darkmap
     };

     // Create overlay object to hold our overlay layer
     var overlayMaps = overlayMaps;

     // Create our map, giving it the streetmap and earthquakes layers to display on load
     // Pass in our baseMaps and overlayMaps
     // Add the layer control to the map
     var myMap = L.map("map", {
         center: [
             37.09, -95.71
         ],
         zoom: 3,
         layers: [streetmap, overlayMaps[url[0].earthquake]]
     });

     // Create a layer control
     var legend = L.control({ position: 'bottomright' });

     legend.onAdd = function(map) {

         var div = L.DomUtil.create('div', 'info legend'),
             grades = [0, 100, 300, 400, 500, 600, 800],
             labels = [];

         // loop through our density intervals and generate a label with a colored square for each interval
         for (var i = 0; i < grades.length; i++) {
             div.innerHTML +=
                 '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                 grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
         }

         return div;
     };

     legend.addTo(myMap);

     L.control.layers(baseMaps, overlayMaps, {
         collapsed: false
     }).addTo(myMap);
 }