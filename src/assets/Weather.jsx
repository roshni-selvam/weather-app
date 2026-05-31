import React, { useState, useEffect } from "react";
import "./Weather.css";

const getBackground = (condition) => {
  if (!condition) return "linear-gradient(to bottom, #2c3e50, #4ca1af)";
  const c = condition.toLowerCase();
  if (c.includes("rain") || c.includes("drizzle"))
    return "linear-gradient(to bottom, #1e3c72, #2a5298)";
  if (c.includes("cloud"))
    return "linear-gradient(to bottom, #606c88, #3f4c6b)";
  if (c.includes("clear"))
    return "linear-gradient(to bottom, #f7971e, #ffd200)";
  if (c.includes("snow"))
    return "linear-gradient(to bottom, #e0eafc, #cfdef3)";
  if (c.includes("thunder") || c.includes("storm"))
    return "linear-gradient(to bottom, #0f0c29, #302b63)";
  if (c.includes("mist") || c.includes("haze") || c.includes("fog"))
    return "linear-gradient(to bottom, #757f9a, #d7dde8)";
  return "linear-gradient(to bottom, #2c3e50, #4ca1af)";
};

const Weather = () => {
  const [city, setCity] = useState("Erode");
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;

  const searchCity = async (cityName) => {
    if (!cityName.trim()) return;
    setError(false);
    setLoading(true);
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`;

      const [weatherRes, forecastRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl),
      ]);

      const weatherJson = await weatherRes.json();
      const forecastJson = await forecastRes.json();

      if (weatherRes.ok) {
        setWeatherData(weatherJson);
        const daily = forecastJson.list.filter((_, index) => index % 8 === 0);
        setForecast(daily);
      } else {
        setError(true);
        setWeatherData(null);
        setForecast(null);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchCity("Erode");
  }, []);

  return (
  <div className="app-container">
    <h1 className="title">Weather App</h1>

    {/* ✅ WEATHER CARD - always visible */}
    <div
      className="weather-card"
      style={{
        background: weatherData
          ? getBackground(weatherData.weather[0].main)
          : "linear-gradient(to bottom, #2c3e50, #4ca1af)",
      }}
    >
      {/* 🔍 Search bar - INSIDE card */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter City Name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchCity(city.trim());
          }}
        />
        <button onClick={() => searchCity(city.trim())}>🔍</button>
      </div>

      {/* ⏳ LOADING */}
      {loading && (
        <div className="loading-card">
          <p style={{ fontSize: "40px" }}>⏳</p>
          <p>Fetching weather...</p>
        </div>
      )}

      {/* ❌ ERROR */}
      {error && !loading && (
        <div className="error-card">
          <p style={{ fontSize: "40px" }}>😕</p>
          <p>City not found</p>
        </div>
      )}

      {/* ✅ WEATHER DATA */}
      {!loading && weatherData && (
        <>
          <div className="weather-main">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
              alt="weather"
            />
            <h1 className="temp">{Math.round(weatherData.main.temp)}°C</h1>
            <p className="weather-desc">{weatherData.weather[0].description}</p>
            <h2 className="city-display">{weatherData.name}</h2>
          </div>

          <div className="stats">
            <div className="stat-item">
              💧<div><p>{weatherData.main.humidity}%</p><span>Humidity</span></div>
            </div>
            <div className="stat-item">
              🌬️<div><p>{weatherData.wind.speed} km/h</p><span>Wind Speed</span></div>
            </div>
            <div className="stat-item">
              🌡️<div><p>{Math.round(weatherData.main.feels_like)}°C</p><span>Feels Like</span></div>
            </div>
            <div className="stat-item">
              🔵<div><p>{weatherData.main.pressure} hPa</p><span>Pressure</span></div>
            </div>
          </div>

          {forecast && (
            <div className="forecast">
              {forecast.map((day, index) => (
                <div className="forecast-item" key={index}>
                  <p className="forecast-day">
                    {new Date(day.dt_txt).toLocaleDateString("en-IN", { weekday: "short" })}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt=""
                  />
                  <p className="forecast-temp">{Math.round(day.main.temp)}°C</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  </div>
);
}
export default Weather;