const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 2000,
};

let map;
let marker;
let data = {
    Univercidad: {
        coords: [-15.8251,-70.0148],
        title: "UNA - PUNO",
        address: 'La Universidad Nacional del Altiplano UNAP es una Institución Pública de Educación Universitaria dedicada a formar profesionales y post graduados calificados, con capacidad de gestión, compromiso social',
        Image: 'imagenes/una.jpg',
    },
    Parque_Pino: {
        coords: [-15.83780,-70.02812],
        title: "PARQUE PINO",
        address: 'Construida a inicios del siglo XX, fue construida después de la guerra con Chile y en honor a esta guerra lleva el Monumento al Dr. Manuel Pino, héroe de dicha guerra',
        Image: 'imagenes/pino.jpg',
    },
    Malecon: {
        coords: [-15.8331,-70.0162],
        title: "MALECON",
        address: 'Se trata de un paseo peatonal con una hermosa vista del lago, donde se encuentran las sukankas o intihuatanas, cuya función principal era la de servir como relojes solares.',
        Image: 'imagenes/malecon.jpg',
    },
    Plaza:  {
        coords: [-15.84062,-70.02797],
        title: "PLAZA DE ARMAS",
        address: 'Es la típica plaza colonial del altiplano, con lindos jardines, hermosa catedral y edificios coloridos. ',
        Image: 'imagenes/plaza.jpg'
    },
};

function initMap() {
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

function success(pos) {
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
        alert(`El lugar turístico más cercano es: ${nearestPlace.title}`);
        vibrateDevice(); // Vibrar el dispositivo
    }
}

function error(err) {
    if (err.code === 1) {
        alert("Please allow geolocation access");
    } else {
        alert("Cannot get current location");
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
    return distance;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function vibrateDevice() {
    if (navigator.vibrate) {
        navigator.vibrate(2000); // Vibrar durante 1 segundo
    }
}

navigator.geolocation.watchPosition(success, error, options);