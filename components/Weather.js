import axios from "axios";
import React, { useEffect, useState } from "react";
import SunnyWeatherSVG from "./SVG/SunnyWeatherSVG";
import dotenv from "dotenv";
dotenv.config();

const Weather = () => {
  // State
  const [weatherData, setWeatherData] = useState({});
  const [location, setLocation] = useState("dhaka");
  const [isLoading, setIsLoading] = useState(false);

  // API KEY AND URL
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

  const fetchWeatherData = () => {
    setIsLoading(true);
    axios
      .get(apiUrl)
      .then((res) => {
        // console.log('weather data:', res.data);
        setWeatherData(res.data)
      })
      .catch((err) => {
        // console.log("weather error:", err)
      })
      .finally(setIsLoading(false));
  };
  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex items-center space-x-2">
          {/* {console.log(weatherData)} */}
          {weatherData?.weather?.length && (
            <img
              className="h-[30px]"
              src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
              alt=""
            />
          )}
          <p className="text-[#F36B24] text-base sm:text-[22px] font-bold">
            {Math.round(weatherData?.main?.temp || 0)}°C
          </p>
          <p className="text-[#6A7077] text-base">
            {weatherData?.weather?.length && weatherData.weather[0].main} <span> | Dhaka, BD</span>
          </p>
          {/* <p className="text-[#6A7077]">{weatherData?.weather?.length && weatherData.weather[0].icon}</p> */}
        </div>
      )}
    </div>
  );
};

export default Weather;
