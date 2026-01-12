# Node.js Web Application Demo

A demonstration web application built with Node.js for testing and learning purposes.

## Overview

This is a demo web application that displays "Hello World", real-time date/time, and weather forecast for Singapore. It's built with Node.js, Express, and Bootstrap 5 for demonstration and educational purposes only.

## Features

- ✨ **Hello World Display** - Beautiful gradient welcome message
- 🕐 **Real-time Clock** - Live date and time display (Singapore timezone)
- 🌤️ **Weather Forecast** - Current weather conditions for Singapore
- 📅 **5-Day Forecast** - Weather predictions with icons
- 📱 **Responsive Design** - Built with Bootstrap 5
- 🎨 **Modern UI** - Gradient backgrounds and smooth animations

## Technologies

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Bootstrap 5** - Frontend CSS framework
- **OpenWeatherMap API** - Weather data (optional)
- **Axios** - HTTP client for API requests
- **dotenv** - Environment variable management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd test-GH-100
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **(Optional)** Configure weather API:
   - Copy `.env.example` to `.env`:
     ```bash
     copy .env.example .env
     ```
   - Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Add your API key to `.env`:
     ```
     WEATHER_API_KEY=your_api_key_here
     ```
   - **Note**: The app works without an API key using mock weather data

4. Start the application:
   ```bash
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
test-GH-100/
├── public/
│   ├── index.html       # Main HTML page with Bootstrap
│   └── js/
│       └── app.js       # Frontend JavaScript (clock & weather)
├── server.js            # Express server & API endpoint
├── package.json         # Project dependencies
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## How It Works

1. **Server** - Express server serves static files and provides a weather API endpoint
2. **Frontend** - Bootstrap-styled HTML page displays the UI
3. **JavaScript** - Updates clock every second and fetches weather data
4. **Weather API** - Retrieves Singapore weather from OpenWeatherMap (or uses mock data)

## API Endpoints

- `GET /` - Main application page
- `GET /api/weather` - Weather data for Singapore (JSON)

## Development

Run with auto-reload during development:
```bash
npm run dev
```

## Demo Purpose Only

⚠️ **Important**: This application is for demonstration purposes only and should not be used in production environments.

## License

This is a demo project for educational purposes.
