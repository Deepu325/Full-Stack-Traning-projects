# 🌐 External API Integration Guide

Guide to integrate Weather API and Google Maps into Travel Planner.

---

## 🌤️ Weather API Integration (OpenWeatherMap)

### Step 1: Get API Key

1. Go to https://openweathermap.org/api
2. Sign up for free account
3. Get your API key from dashboard
4. Free tier: 1000 calls/day

### Step 2: Add Weather Function

Create `js/weather.js`:
```javascript
const WEATHER_API_KEY = 'your_openweathermap_api_key';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

async function getWeatherForecast(destination) {
    try {
        // Get coordinates from city name
        const geoResponse = await fetch(
            `${WEATHER_API_URL}/weather?q=${destination}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const geoData = await geoResponse.json();
        
        if (geoData.cod !== 200) {
            throw new Error('City not found');
        }
        
        const { coord } = geoData;
        
        // Get 5-day forecast
        const forecastResponse = await fetch(
            `${WEATHER_API_URL}/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const forecastData = await forecastResponse.json();
        
        return {
            current: {
                temp: Math.round(geoData.main.temp),
                feels_like: Math.round(geoData.main.feels_like),
                humidity: geoData.main.humidity,
                description: geoData.weather[0].description,
                icon: geoData.weather[0].icon
            },
            forecast: processForecast(forecastData.list)
        };
    } catch (error) {
        console.error('Weather API Error:', error);
        return null;
    }
}

function processForecast(list) {
    // Group by day and get one forecast per day
    const dailyForecasts = {};
    
    list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
                date: date,
                temp: Math.round(item.main.temp),
                description: item.weather[0].description,
                icon: item.weather[0].icon
            };
        }
    });
    
    return Object.values(dailyForecasts).slice(0, 5);
}

function displayWeather(weatherData) {
    if (!weatherData) {
        return '<p>Unable to load weather data</p>';
    }
    
    const { current, forecast } = weatherData;
    
    let html = `
        <div class="weather-current">
            <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/${current.icon}@4x.png" alt="${current.description}">
            </div>
            <div class="weather-info">
                <h2>${current.temp}°C</h2>
                <p>${current.description}</p>
                <p>Feels like ${current.feels_like}°C</p>
                <p>Humidity: ${current.humidity}%</p>
            </div>
        </div>
        
        <div class="weather-forecast">
            <h3>5-Day Forecast</h3>
            <div class="forecast-grid">
    `;
    
    forecast.forEach(day => {
        html += `
            <div class="forecast-day">
                <p>${formatDate(day.date)}</p>
                <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.description}">
                <p>${day.temp}°C</p>
                <p>${day.description}</p>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
```

### Step 3: Update trip-details.js

```javascript
// In loadWeather function
async function loadWeather() {
    const container = document.getElementById('weatherContainer');
    container.innerHTML = '<div class="loading">Loading weather...</div>';
    
    if (!currentTrip) return;
    
    const weatherData = await getWeatherForecast(currentTrip.destination);
    container.innerHTML = displayWeather(weatherData);
}
```

### Step 4: Add Weather CSS

```css
.weather-current {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
}

.weather-icon img {
    width: 150px;
    height: 150px;
}

.weather-info h2 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
}

.weather-forecast h3 {
    margin-bottom: 1rem;
}

.forecast-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
}

.forecast-day {
    text-align: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
}

.forecast-day img {
    width: 60px;
    height: 60px;
}
```

---

## 🗺️ Google Maps Integration

### Step 1: Get API Key

1. Go to https://console.cloud.google.com
2. Create new project
3. Enable Maps JavaScript API
4. Create API key
5. Restrict key to your domain

### Step 2: Add Maps Script

In `trip-details.html`:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
```

### Step 3: Add Maps Function

Create `js/maps.js`:
```javascript
let map;
let marker;
let geocoder;

function initMap() {
    // Initialize geocoder
    geocoder = new google.maps.Geocoder();
}

async function loadMap() {
    const container = document.getElementById('mapContainer');
    
    if (!currentTrip) return;
    
    // Clear container
    container.innerHTML = '<div id="map" style="width: 100%; height: 500px;"></div>';
    
    try {
        // Geocode destination
        const results = await geocodeAddress(currentTrip.destination);
        
        if (results && results.length > 0) {
            const location = results[0].geometry.location;
            
            // Create map
            map = new google.maps.Map(document.getElementById('map'), {
                center: location,
                zoom: 12,
                styles: [
                    {
                        "featureType": "all",
                        "elementType": "geometry",
                        "stylers": [{"color": "#242f3e"}]
                    },
                    {
                        "featureType": "all",
                        "elementType": "labels.text.stroke",
                        "stylers": [{"lightness": -80}]
                    },
                    {
                        "featureType": "administrative",
                        "elementType": "labels.text.fill",
                        "stylers": [{"color": "#746855"}]
                    }
                ]
            });
            
            // Add marker
            marker = new google.maps.Marker({
                position: location,
                map: map,
                title: currentTrip.destination,
                animation: google.maps.Animation.DROP
            });
            
            // Add info window
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="color: #000; padding: 10px;">
                        <h3>${currentTrip.destination}</h3>
                        <p>${formatDate(currentTrip.start_date)} - ${formatDate(currentTrip.end_date)}</p>
                    </div>
                `
            });
            
            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });
            
            // Show info window by default
            infoWindow.open(map, marker);
        }
    } catch (error) {
        console.error('Maps Error:', error);
        container.innerHTML = '<p>Unable to load map</p>';
    }
}

function geocodeAddress(address) {
    return new Promise((resolve, reject) => {
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK') {
                resolve(results);
            } else {
                reject(status);
            }
        });
    });
}
```

### Step 4: Update trip-details.js

```javascript
// Update loadMap function
async function loadMap() {
    if (typeof google === 'undefined') {
        document.getElementById('mapContainer').innerHTML = 
            '<p>Google Maps not loaded. Please check your API key.</p>';
        return;
    }
    
    await loadMapWithDestination();
}
```

### Step 5: Add Maps CSS

```css
#map {
    width: 100%;
    height: 500px;
    border-radius: 12px;
    overflow: hidden;
}

.map-container {
    padding: 0;
}
```

---

## 🔐 Security Best Practices

### 1. Environment Variables

Don't hardcode API keys in frontend. Use environment variables:

```javascript
// config.js
const CONFIG = {
    WEATHER_API_KEY: process.env.WEATHER_API_KEY || 'your_key_here',
    MAPS_API_KEY: process.env.MAPS_API_KEY || 'your_key_here'
};
```

### 2. Backend Proxy (Recommended)

Create backend endpoints to proxy API calls:

```javascript
// Backend: routes/weatherRoutes.js
router.get('/weather/:city', async (req, res) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=${process.env.WEATHER_API_KEY}`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Weather API error' });
    }
});
```

Frontend calls backend instead:
```javascript
const response = await fetch(`${API_URL}/weather/${destination}`);
```

### 3. API Key Restrictions

- **OpenWeatherMap:** Restrict by domain
- **Google Maps:** Restrict by HTTP referrer

---

## 📊 Alternative APIs

### Weather Alternatives
1. **WeatherAPI.com** - Free tier: 1M calls/month
2. **Weatherbit.io** - Free tier: 500 calls/day
3. **Tomorrow.io** - Free tier: 500 calls/day

### Maps Alternatives
1. **Mapbox** - Free tier: 50k loads/month
2. **Leaflet + OpenStreetMap** - Completely free
3. **HERE Maps** - Free tier: 250k transactions/month

---

## 🎨 Leaflet (Free Alternative to Google Maps)

### Step 1: Add Leaflet

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

### Step 2: Initialize Map

```javascript
async function loadLeafletMap() {
    const container = document.getElementById('mapContainer');
    container.innerHTML = '<div id="map" style="width: 100%; height: 500px;"></div>';
    
    // Get coordinates from Nominatim (free geocoding)
    const coords = await geocodeWithNominatim(currentTrip.destination);
    
    if (coords) {
        const map = L.map('map').setView([coords.lat, coords.lon], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        L.marker([coords.lat, coords.lon])
            .addTo(map)
            .bindPopup(currentTrip.destination)
            .openPopup();
    }
}

async function geocodeWithNominatim(address) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();
        
        if (data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon)
            };
        }
    } catch (error) {
        console.error('Geocoding error:', error);
    }
    return null;
}
```

---

## ✅ Integration Checklist

### Weather API
- [ ] API key obtained
- [ ] Weather function created
- [ ] Display function implemented
- [ ] CSS styles added
- [ ] Error handling added
- [ ] Loading states implemented

### Maps API
- [ ] API key obtained
- [ ] Maps script loaded
- [ ] Map initialization working
- [ ] Markers displayed
- [ ] Info windows working
- [ ] Styles applied

### Security
- [ ] API keys not in frontend code
- [ ] Backend proxy implemented
- [ ] API key restrictions set
- [ ] Rate limiting considered

---

## 🚀 Quick Start

1. **Get API Keys**
   - OpenWeatherMap: https://openweathermap.org/api
   - Google Maps: https://console.cloud.google.com

2. **Add to Project**
   - Create `js/weather.js`
   - Create `js/maps.js`
   - Update `trip-details.html`

3. **Test**
   - Load trip details page
   - Click Weather tab
   - Click Map tab
   - Verify data loads

---

**API Integration Complete! 🎉**

Your Travel Planner now has weather forecasts and interactive maps!
