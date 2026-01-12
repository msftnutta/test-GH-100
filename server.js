require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Mock data for different locations
const mockWeatherData = {
  'Singapore': { temp: 28, desc: 'Partly Cloudy', humidity: 75, wind: 12 },
  'Manila': { temp: 30, desc: 'Sunny', humidity: 70, wind: 15 },
  'Melbourne': { temp: 18, desc: 'Cloudy', humidity: 65, wind: 20 },
  'Sydney': { temp: 22, desc: 'Clear', humidity: 60, wind: 18 },
  'Kuala Lumpur': { temp: 29, desc: 'Thunderstorm', humidity: 80, wind: 10 },
  'Los Angeles': { temp: 20, desc: 'Clear', humidity: 55, wind: 14 }
};

// API endpoint to get weather data for multiple locations
app.get('/api/weather', async (req, res) => {
  const locations = [
    { name: 'Singapore', query: 'Singapore' },
    { name: 'Manila', query: 'Manila,PH' },
    { name: 'Melbourne', query: 'Melbourne,AU' },
    { name: 'Sydney', query: 'Sydney,AU' },
    { name: 'Kuala Lumpur', query: 'Kuala Lumpur,MY' },
    { name: 'Los Angeles', query: 'Los Angeles,US' }
  ];

  try {
    const API_KEY = process.env.WEATHER_API_KEY;
    
    if (!API_KEY) {
      // Return mock data for all locations if no API key is configured
      const allWeather = locations.map(loc => {
        const mock = mockWeatherData[loc.name];
        return {
          location: loc.name,
          temperature: mock.temp,
          description: mock.desc,
          humidity: mock.humidity,
          windSpeed: mock.wind,
          forecast: [
            { day: 'Today', temp: mock.temp, condition: mock.desc, icon: getWeatherEmoji(mock.desc) },
            { day: 'Tomorrow', temp: mock.temp + 1, condition: 'Sunny', icon: '☀️' },
            { day: 'Day 3', temp: mock.temp - 1, condition: 'Cloudy', icon: '☁️' },
            { day: 'Day 4', temp: mock.temp, condition: 'Partly Cloudy', icon: '⛅' },
            { day: 'Day 5', temp: mock.temp + 2, condition: 'Clear', icon: '☀️' }
          ],
          mock: true
        };
      });
      return res.json(allWeather);
    }

    // Fetch real weather data for all locations
    const weatherPromises = locations.map(loc =>
      axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${loc.query}&units=metric&appid=${API_KEY}`
      ).then(response => ({
        location: loc.name,
        data: response.data
      })).catch(error => ({
        location: loc.name,
        error: error.message
      }))
    );

    const results = await Promise.all(weatherPromises);
    
    const allWeather = results.map(result => {
      if (result.error) {
        // Use mock data for this location on error
        const mock = mockWeatherData[result.location];
        return {
          location: result.location,
          temperature: mock.temp,
          description: mock.desc,
          humidity: mock.humidity,
          windSpeed: mock.wind,
          forecast: [
            { day: 'Today', temp: mock.temp, condition: mock.desc, icon: getWeatherEmoji(mock.desc) },
            { day: 'Tomorrow', temp: mock.temp + 1, condition: 'Sunny', icon: '☀️' },
            { day: 'Day 3', temp: mock.temp - 1, condition: 'Cloudy', icon: '☁️' },
            { day: 'Day 4', temp: mock.temp, condition: 'Partly Cloudy', icon: '⛅' },
            { day: 'Day 5', temp: mock.temp + 2, condition: 'Clear', icon: '☀️' }
          ],
          mock: true
        };
      }

      const current = result.data.list[0];
      const forecast = result.data.list
        .filter((item, index) => index % 8 === 0)
        .slice(0, 5)
        .map((item, index) => ({
          day: index === 0 ? 'Today' : `Day ${index + 1}`,
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main,
          icon: getWeatherIcon(item.weather[0].main)
        }));

      return {
        location: result.location,
        temperature: Math.round(current.main.temp),
        description: current.weather[0].description,
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind.speed * 3.6),
        forecast: forecast,
        mock: false
      };
    });

    res.json(allWeather);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    // Return mock data for all locations on error
    const allWeather = locations.map(loc => {
      const mock = mockWeatherData[loc.name];
      return {
        location: loc.name,
        temperature: mock.temp,
        description: mock.desc,
        humidity: mock.humidity,
        windSpeed: mock.wind,
        forecast: [
          { day: 'Today', temp: mock.temp, condition: mock.desc, icon: getWeatherEmoji(mock.desc) },
          { day: 'Tomorrow', temp: mock.temp + 1, condition: 'Sunny', icon: '☀️' },
          { day: 'Day 3', temp: mock.temp - 1, condition: 'Cloudy', icon: '☁️' },
          { day: 'Day 4', temp: mock.temp, condition: 'Partly Cloudy', icon: '⛅' },
          { day: 'Day 5', temp: mock.temp + 2, condition: 'Clear', icon: '☀️' }
        ],
        mock: true
      };
    });
    res.json(allWeather);
  }
});

// Helper function to get weather icons
function getWeatherIcon(condition) {
  const icons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️'
  };
  return icons[condition] || '⛅';
}

// Helper function to get weather emoji from description
function getWeatherEmoji(description) {
  description = description.toLowerCase();
  if (description.includes('clear') || description.includes('sunny')) return '☀️';
  if (description.includes('cloud')) return '☁️';
  if (description.includes('rain')) return '🌧️';
  if (description.includes('drizzle')) return '🌦️';
  if (description.includes('thunder') || description.includes('storm')) return '⛈️';
  if (description.includes('snow')) return '❄️';
  if (description.includes('mist') || description.includes('fog')) return '🌫️';
  return '⛅';
}

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📍 Demo app with weather forecast for multiple locations`);
  console.log(`   🌏 Singapore | Philippines | Melbourne | Sydney | Malaysia | California`);
  if (!process.env.WEATHER_API_KEY) {
    console.log(`⚠️  No WEATHER_API_KEY found - using mock data`);
    console.log(`   Get a free API key at https://openweathermap.org/api`);
  }
});
