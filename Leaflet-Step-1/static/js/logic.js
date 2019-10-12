var queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data.features);
  createFeatures(data.features);
});

function createFeatures(data) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup(
      "<h3>" +
        feature.properties.place +
        "</h3><hr><p>" +
        new Date(feature.properties.time) +
        "</p>"
    );
  }
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(data, {
    onEachFeature: onEachFeature,

    pointToLayer: function(feature, latlng) {
      return L.circle(latlng);
    }
  });

  // var color = "";
  // if (data.feature.properties.mag < 1) {
  //   color = "green";
  // } else if (data.feature.properties.mag < 2) {
  //   color = "yellow";
  // } else if (data.feature.properties.mag < 3) {
  //   color = "orange";
  // } else if (data.feature.properties.mag < 4) {
  //   color = "dark orange";
  // } else if (data.feature.properties.mag < 5) {
  //   color = "red orange";
  // } else {
  //   color = "red";
  // }
  function chooseColor(mag) {
    if (mag < 1) {
      color = "green";
    } else if (mag < 2) {
      color = "yellow";
    } else if (mag < 3) {
      color = "orange";
    } else if (mag < 4) {
      color = "dark orange";
    } else if (mag < 5) {
      color = "red orange";
    } else {
      color = "red";
    }
  }
  var geojsonMarkerOptions = {
    radius: feature.properties.mag * 1000,
    fillColor: chooseColor(feature.properties.mag),
    color: chooseColor(feature.properties.mag),
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };

  var legend = L.control({
    position: "bottomright"
  });

  // When the layer control is added, insert a div with the class of "legend"
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };
  // Add the info legend to the map
  legend.addTo(map);
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    }
  );

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: true
    })
    .addTo(myMap);
}
