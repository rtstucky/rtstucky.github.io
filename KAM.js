const introLayer = L.geoJSON(Introduction, {
  style: {
    color: "#26867c",
    weight: 3,
    fillColor: "#39c9bb",
    fillOpacity: 0.5
  }
});

const rule9Layer = L.geoJSON(Rule9, {
  style: function(feature) {
    // Access the RESTAURANT property in feature.properties
    if (feature.properties && feature.properties.Restauraun === "PERMITTED") {
      return {
        color: "#39c9bb",
        fillColor: "#39c9bb",
        fillOpacity: 1
      };
    } else if (feature.properties && feature.properties.Restauraun === "NOT PERMITTED") {
      return {
        color: "black",
        fillColor: "black",
        fillOpacity: 1
      };
    } else {
      // Default style if RESTAURANT value is missing or something else
      return {
        fillColor: "#cccccc",
        fillOpacity: 1
      };
    }
  }
});

// Get centroid of Introduction to center the map initially
const introBounds = introLayer.getBounds();
const introCenter = introBounds.getCenter();

// Initialize Leaflet map at Introduction centroid
const map = L.map('map').setView([introCenter.lat, introCenter.lng], 18);

/* Add base tile layer
L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png', {
  maxZoom: 20,
  attribution: '...'
}).addTo(map); */

L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png?api_key=4f4c222f-cf1d-412d-a93a-e8bdaf1e4a3d', {
  maxZoom: 20,
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://stamen.com/">Stamen Design</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// Add only the Introduction layer initially
introLayer.addTo(map);

// Scroll handling on the #story container
const storyBox = document.getElementById('story');
const chapters = storyBox.querySelectorAll('.chapter');
let currentChapterId = 'Introduction';

storyBox.addEventListener('scroll', () => {
  for (const section of chapters) {
    const rect = section.getBoundingClientRect();
    const containerRect = storyBox.getBoundingClientRect();

    // Calculate position of section relative to container viewport
    const offsetTop = rect.top - containerRect.top;

    // Check if section is visible inside the container viewport
    if (offsetTop < storyBox.clientHeight && (offsetTop + rect.height) > 0) {
      if (section.id !== currentChapterId) {
        currentChapterId = section.id;

        // Remove both layers if present
        if (map.hasLayer(introLayer)) map.removeLayer(introLayer);
        if (map.hasLayer(rule9Layer)) map.removeLayer(rule9Layer);

        // Add and fly to the appropriate layer
        if (currentChapterId === 'Introduction') {
          introLayer.addTo(map);
          map.flyToBounds(introLayer.getBounds(), { padding: [40, 40], duration:1 });
        } else if (currentChapterId === 'Rule9') {
          rule9Layer.addTo(map);
          map.flyToBounds(rule9Layer.getBounds(), { padding: [40, 40], duration:1 });
        }
      }
      break; // Only handle the first visible chapter
    }
  }
});