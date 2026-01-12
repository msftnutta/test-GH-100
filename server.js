require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// API endpoint to get weather data for Singapore
app.get('/api/weather', async (req, res) => {
  try {
    const API_KEY = process.env.WEATHER_API_KEY;
    
    if (!API_KEY) {
      // Return mock data if no API key is configured
      return res.json({
        location: 'Singapore',
        temperature: 28,
        description: 'Partly Cloudy',
        humidity: 75,
        windSpeed: 12,
        forecast: [
          { day: 'Today', temp: 28, condition: 'Partly Cloudy', icon: '⛅' },
          { day: 'Tomorrow', temp: 29, condition: 'Sunny', icon: '☀️' },
          { day: 'Day 3', temp: 27, condition: 'Rainy', icon: '🌧️' },
          { day: 'Day 4', temp: 28, condition: 'Cloudy', icon: '☁️' },
          { day: 'Day 5', temp: 30, condition: 'Sunny', icon: '☀️' }
        ],
        mock: true
      });
    }

    // Using OpenWeatherMap API (you can sign up for a free API key at openweathermap.org)
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=Singapore&units=metric&appid=${API_KEY}`
    );

    const current = response.data.list[0];
    const forecast = response.data.list
      .filter((item, index) => index % 8 === 0) // Get one forecast per day
      .slice(0, 5)
      .map((item, index) => ({
        day: index === 0 ? 'Today' : `Day ${index + 1}`,
        temp: Math.round(item.main.temp),
        condition: item.weather[0].main,
        icon: getWeatherIcon(item.weather[0].main)
      }));

    res.json({
      location: 'Singapore',
      temperature: Math.round(current.main.temp),
      description: current.weather[0].description,
      humidity: current.main.humidity,
      windSpeed: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
      forecast: forecast,
      mock: false
    });
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    // Return mock data on error
    res.json({
      location: 'Singapore',
      temperature: 28,
      description: 'Partly Cloudy',
      humidity: 75,
      windSpeed: 12,
      forecast: [
        { day: 'Today', temp: 28, condition: 'Partly Cloudy', icon: '⛅' },
        { day: 'Tomorrow', temp: 29, condition: 'Sunny', icon: '☀️' },
        { day: 'Day 3', temp: 27, condition: 'Rainy', icon: '🌧️' },
        { day: 'Day 4', temp: 28, condition: 'Cloudy', icon: '☁️' },
        { day: 'Day 5', temp: 30, condition: 'Sunny', icon: '☀️' }
      ],
      mock: true,
      error: error.message
    });
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

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📍 Demo app with weather forecast for Singapore`);
  if (!process.env.WEATHER_API_KEY) {
    console.log(`⚠️  No WEATHER_API_KEY found - using mock data`);
    console.log(`   Get a free API key at https://openweathermap.org/api`);
  }
});
