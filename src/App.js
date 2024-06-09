import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [isFahrenheit, setIsFahrenheit] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleUnit = () => {
    setIsFahrenheit(!isFahrenheit);
  };

  const getTemperature = (temp) => {
    if (isFahrenheit) {
      return `${temp.toFixed()}°F`;
    } else {
      return `${((temp - 32) * (5 / 9)).toFixed()}°C`;
    }
  };

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=35474b0baa4b81c784e5b005174fcb3e`;

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios
        .get(url)
        .then((response) => {
          setData(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
          setData({});
        });
      setLocation('');
    }
  };

  return (
    <div className="container">
      <div className="datetime">{currentDateTime}</div>
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
        <button onClick={searchLocation}>Search</button>
      </div>
      {data.name !== undefined && (
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{getTemperature(data.main.temp)}</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>
      )}
      {data.name !== undefined && (
        <div className="bottom">
          <div className="feels">
            {data.main ? (
              <p className="bold">{getTemperature(data.main.feels_like)}</p>
            ) : null}
            <p>Feels Like</p>
          </div>
          <div className="humidity">
            {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
            <p>Humidity</p>
          </div>
          <div className="wind">
            {data.wind ? <p className="bold">{data.wind.speed.toFixed()} MPH</p> : null}
            <p>Wind Speed</p>
          </div>
        </div>
      )}
      <div className="unit-toggle">
        <button onClick={toggleUnit}>
          {isFahrenheit ? 'Switch to Celsius' : 'Switch to Fahrenheit'}
        </button>
      </div>
    </div>
  );
}

export default App;

