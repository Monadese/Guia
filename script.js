fetch('listar.php')
  .then(response => response.json())
  .then(data => {
    // Usar los datos obtenidos en el archivo JavaScript
    data.forEach(place => {
      const obj = {
        coords: [place.latitud, place.longitud],
        title: place.nombre,
        address: place.descripcion,
        Image: place.archivo
      };
      // Accede a los datos individuales del lugar y haz lo que necesites con ellos
      console.log(obj.coords);
      console.log(obj.title);
      console.log(obj.address);
      console.log(obj.Image);
    });
    initMap(data);
    watchUserLocation(data);
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 2000,
  };
  
  let map;
  let marker;
  
  
  function initMap(data) {
    map = L.map('map').setView([0, 0], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
  
    for (let key in data) {
      const obj = data[key];
      const icon = L.icon({
        iconUrl: obj.Image,
        iconSize: [50, 50],
        iconAnchor: [25, 50]
      });
      L.marker(obj.coords, {
        title: obj.title,
        icon: icon
      }).bindPopup(
        `<div class="popup-content sm ">
                  <div class="image-container">
                      <img src="${obj.Image}" alt="${obj.title}" class="popup-image">
                  </div>
                  <h4>${obj.title}</h4>
                  <p>${obj.address}</p>
              </div>`
      ).addTo(map);
    }
  }
  
  function success(pos,data) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;
  
    document.getElementById('output').innerText = `
      Coordenadas de Usuario:
      Latitude ${lat}.
      Longitude ${lng}.
      Estimación precisa dentro de ${Math.round(accuracy)} metros.`;
  
    if (!map) {
      initMap();
    }
  
    if (marker) {
      map.removeLayer(marker);
    }
  
    marker = L.marker([lat, lng]).addTo(map);
    map.setView([lat, lng]);
  
    // Calcular distancias y encontrar el lugar más cercano
    let nearestPlace = null;
    let nearestDistance = Infinity;
  
    for (let key in data) {
      const obj = data[key];
      const distance = calculateDistance(lat, lng, obj.coords[0], obj.coords[1]);
  
      if (distance < nearestDistance) {
        nearestPlace = obj;
        nearestDistance = distance;
      }
    }
  
    if (nearestPlace) {
      if (nearestDistance <= 50) {
        vibrateDevice(); // Vibrar el dispositivo
      }
      alert(`El lugar turístico más cercano es: ${nearestPlace.title}`);
    }
  }
  
  function error(err) {
    if (err.code === 1) {
      alert("Permita el acceso a la geolocalización");
    } else {
      alert("No se puede obtener la ubicación actual");
    }
  }
  
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance * 1000; // Convertir a metros
  }
  
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  function vibrateDevice() {
    if (navigator.vibrate) {
      navigator.vibrate(2000); // Vibrar durante 2 segundos
    }
  }
  
  navigator.geolocation.watchPosition(success, error, options);