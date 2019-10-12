// Creating map object
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Adding tile layer
L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }
).addTo(myMap);

//  variable for data:
var queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// function to choose color
function chooseColor(magnitude) {
  if (magnitude > 5) {
    return "Red";
  } else if (magnitude > 4) {
    return "OrangeRed";
  } else if (magnitude > 3) {
    return "DarkOrange";
  } else if (magnitude > 2) {
    return "Orange";
  } else if (magnitude > 1) {
    return "Yellow";
  } else {
    return "Green";
  }
}

var geojson;

// create function for circle size based on magnitude
function markerSize(magnitude) {
  return magnitude * 5;
}
// Grabbing GeoJSON data and adding features to map
d3.json(queryUrl, function(data) {
  console.log(data.features);
  L.geoJson(data, {
    // Style each feature ()
    style: function(feature) {
      return {
        color: chooseColor(feature.properties.mag),
        fillColor: chooseColor(feature.properties.mag),
        fillOpacity: 0.5,
        radius: markerSize(feature.properties.mag)
      };
    },
    onEachFeature(feature, layer) {
      layer.bindPopup(
        "<h3>" +
          feature.properties.place +
          "</h3><hr><p>" +
          new Date(feature.properties.time) +
          "</p>"
      );
    },
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    }
  }).addTo(myMap);
});
