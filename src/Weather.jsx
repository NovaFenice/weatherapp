import { useState, useEffect } from 'react';
import './css/Weather.css';

function Weather({ city, theme }) {
    const [weather, setWeather] = useState(null);
    const [tempUnit, setTempUnit] = useState('C'); // C, F, K
    const [windUnit, setWindUnit] = useState('m/s'); // m/s, km/h
    const [pressureUnit, setPressureUnit] = useState('hPa'); // hPa, atm, mmHg
    const API_KEY = 'API_KEY_OPENWEATHERMAP';

    useEffect(() => {
        if (!city) return;

        const fetchWeather = async () => {
            try {
                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${API_KEY}`
                );
                const data = await res.json();
                setWeather(data);
            } catch (err) {
                console.error('Errore fetch meteo: ', err);
            }
        };

        fetchWeather();
    }, [city]);

    const convertTemp = (tempC) => {
        if (tempUnit === 'C') return `${Math.round(tempC)}°C`;
        if (tempUnit === 'F') return `${Math.round((tempC * 9) / 5 + 32)}°F`;
        return `${Math.round(tempC + 273.15)}K`;
    };

    const convertWind = (speed) => {
        if (windUnit === 'm/s') return `${Math.round(speed)} m/s`;
        return `${Math.round(speed * 3.6)} km/h`;
    };

    const convertPressure = (pressure) => {
        if (pressureUnit === 'hPa') return `${pressure} hPa`;
        if (pressureUnit === 'atm') return `${(pressure / 1013.25).toFixed(2)} atm`;
        return `${(pressure * 0.750062).toFixed(0)} mmHg`;
    };

    const toggleTempUnit = () =>
        setTempUnit(prev => (prev === 'C' ? 'F' : prev === 'F' ? 'K' : 'C'));

    const toggleWindUnit = () =>
        setWindUnit(prev => (prev === 'm/s' ? 'km/h' : 'm/s'));

    const togglePressureUnit = () =>
        setPressureUnit(prev => (prev === 'hPa' ? 'atm' : prev === 'atm' ? 'mmHg' : 'hPa'));

    if (!weather) return <p className="loading-text">Caricamento meteo...</p>;

    const { main, wind, sys, weather: info } = weather;
    const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(sys.sunset * 1000).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const iconUrl = `https://openweathermap.org/img/wn/${info[0].icon}@2x.png`;

    return (
        <div className={`weather-card ${theme}`}>
            <h2>{weather.name}, {sys.country}</h2>
            <img src={iconUrl} alt={info[0].description} />

            <p className="temp" onClick={toggleTempUnit}>
                {convertTemp(main.temp)}
            </p>

            <p onClick={toggleWindUnit} className="clickable">
                Vento: {convertWind(wind.speed)}
            </p>

            <p className="clickable" onClick={togglePressureUnit}>
                Pressione: {convertPressure(main.pressure)}
            </p>

            <p>Umidità: {main.humidity}%</p>
            <p>Alba: {sunrise}</p>
            <p>Tramonto: {sunset}</p>
        </div>
    );
}

export default Weather;