// Update date and time every second
function updateDateTime() {
    const now = new Date();
    
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Singapore',
        hour12: true
    };
    
    const dateTimeString = now.toLocaleString('en-SG', options);
    document.getElementById('datetime').textContent = dateTimeString;
}

// Fetch weather data from the API
async function fetchWeather() {
    try {
        const response = await fetch('/api/weather');
        const weatherData = await response.json();
        
        // Hide loading, show content
        document.getElementById('weatherLoading').style.display = 'none';
        document.getElementById('weatherContent').style.display = 'block';
        
        const weatherCardsContainer = document.getElementById('weatherCards');
        weatherCardsContainer.innerHTML = '';
        
        // Create a card for each location
        weatherData.forEach(data => {
            const locationCard = document.createElement('div');
            locationCard.className = 'col-md-6 col-lg-4';
            
            // Build forecast HTML
            let forecastHTML = '';
            data.forecast.forEach(day => {
                forecastHTML += `
                    <div class="col">
                        <div class="forecast-card" style="padding: 10px; font-size: 0.85rem;">
                            <div class="forecast-icon" style="font-size: 1.5rem;">${day.icon}</div>
                            <div class="fw-bold small">${day.day}</div>
                            <div class="fs-6">${day.temp}°C</div>
                            <div class="small" style="font-size: 0.7rem;">${day.condition}</div>
                        </div>
                    </div>
                `;
            });
            
            locationCard.innerHTML = `
                <div class="location-weather-card">
                    <h3 class="location-title">
                        <i class="bi bi-geo-alt-fill"></i>
                        ${data.location}
                    </h3>
                    
                    <!-- Current Weather -->
                    <div class="text-center mb-3">
                        <div class="weather-icon" style="font-size: 3rem;">${getWeatherEmoji(data.description)}</div>
                        <div class="temperature" style="font-size: 2.5rem;">${data.temperature}°C</div>
                        <div class="text-muted">${data.description.charAt(0).toUpperCase() + data.description.slice(1)}</div>
                    </div>
                    
                    <!-- Weather Details -->
                    <div class="mb-3">
                        <div class="small mb-1">
                            <i class="bi bi-droplet-fill text-info"></i>
                            <strong>Humidity:</strong> ${data.humidity}%
                        </div>
                        <div class="small">
                            <i class="bi bi-wind text-success"></i>
                            <strong>Wind:</strong> ${data.windSpeed} km/h
                        </div>
                    </div>
                    
                    <!-- Forecast -->
                    <h6 class="mb-2">5-Day Forecast</h6>
                    <div class="row row-cols-5 g-1">
                        ${forecastHTML}
                    </div>
                </div>
            `;
            
            weatherCardsContainer.appendChild(locationCard);
        });
        
        // Show mock data warning if applicable
        if (weatherData.length > 0 && weatherData[0].mock) {
            document.getElementById('mockWarning').style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        document.getElementById('weatherLoading').innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle-fill"></i>
                Failed to load weather data. Please try again later.
            </div>
        `;
    }
}

// Helper function to get weather emoji based on description
function getWeatherEmoji(description) {
    description = description.toLowerCase();
    
    if (description.includes('clear') || description.includes('sunny')) return '☀️';
    if (description.includes('cloud')) return '☁️';
    if (description.includes('rain')) return '🌧️';
    if (description.includes('drizzle')) return '🌦️';
    if (description.includes('thunder') || description.includes('storm')) return '⛈️';
    if (description.includes('snow')) return '❄️';
    if (description.includes('mist') || description.includes('fog')) return '🌫️';
    
    return '⛅'; // Default
}

// Initialize the app
function init() {
    // Update date/time immediately and then every second
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Fetch weather data
    fetchWeather();
    
    // Refresh weather data every 10 minutes
    setInterval(fetchWeather, 600000);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
