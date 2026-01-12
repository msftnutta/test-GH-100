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
        const data = await response.json();
        
        // Hide loading, show content
        document.getElementById('weatherLoading').style.display = 'none';
        document.getElementById('weatherContent').style.display = 'block';
        
        // Update current weather
        document.getElementById('weatherIcon').textContent = getWeatherEmoji(data.description);
        document.getElementById('temperature').textContent = `${data.temperature}°C`;
        document.getElementById('description').textContent = data.description.charAt(0).toUpperCase() + data.description.slice(1);
        document.getElementById('humidity').textContent = data.humidity;
        document.getElementById('windSpeed').textContent = data.windSpeed;
        document.getElementById('location').textContent = data.location;
        
        // Update forecast
        const forecastContainer = document.getElementById('forecast');
        forecastContainer.innerHTML = '';
        
        data.forecast.forEach(day => {
            const forecastCard = `
                <div class="col">
                    <div class="forecast-card">
                        <div class="forecast-icon">${day.icon}</div>
                        <div class="fw-bold">${day.day}</div>
                        <div class="fs-4">${day.temp}°C</div>
                        <div class="small">${day.condition}</div>
                    </div>
                </div>
            `;
            forecastContainer.innerHTML += forecastCard;
        });
        
        // Show mock data warning if applicable
        if (data.mock) {
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
