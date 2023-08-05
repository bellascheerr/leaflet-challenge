// Function to get the marker size based on magnitude
function getMarkerSize(magnitude) {
    return magnitude * 5;
  }
  
  // Function to get the marker color based on magnitude
  function getMarkerColor(magnitude) {
    // Define a color scale with visually distinguishable colors
    const colorScale = ['#feebe2', '#fbb4b9', '#f768a1', '#ae017e', '#7a0177'];
  
    if (magnitude >= 7) return colorScale[4];
    else if (magnitude >= 6) return colorScale[3];
    else if (magnitude >= 5) return colorScale[2];
    else if (magnitude >= 4) return colorScale[1];
    else return colorScale[0];
  }
  
  // Create the Leaflet map
  const map = L.map('map').setView([0, 0], 2);
  
  // Add the basemap (you can choose different ones if you like)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  
  // Fetch earthquake data from the provided URL
  fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson')
    .then(response => response.json())
    .then(data => {
      // Loop through the earthquake data and create markers
      data.features.forEach(quake => {
        const { mag, place, depth } = quake.properties;
        const [lat, lng] = quake.geometry.coordinates;
  
        // Create the marker and customize it based on magnitude and depth
        L.circleMarker([lat, lng], {
          radius: getMarkerSize(mag),
          fillColor: getMarkerColor(mag),
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup(`Magnitude: ${mag}<br>Location: ${place}<br>Depth: ${depth}`).addTo(map);
      });
    })
    .catch(error => {
      console.error('Error fetching earthquake data:', error);
    });
  
  // Create the legend
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
    const magnitudes = [4, 5, 6, 7];
    const labels = [];
    for (let i = 0; i < magnitudes.length; i++) {
      labels.push(
        `<i style="background: ${getMarkerColor(magnitudes[i] + 0.5)}"></i> ${magnitudes[i]}${
          magnitudes[i + 1] ? '&ndash;' + (magnitudes[i + 1] - 0.1) : '+'
        }<br>`
      );
    }
    div.innerHTML = labels.join('');
    return div;
  };
  legend.addTo(map);
  