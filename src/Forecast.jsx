import { useEffect, useState } from "react";
import './css/Forecast.css';

function Forecast({ city, theme }) {
    const [forecast, setForecast] = useState([]);
    const [unit, setUnit] = useState('C'); // C, F, K
    const API_KEY = 'API_KEY_OPENWEATHERMAP';

    useEffect(() => {
        if (!city) return;

        const fetchForecast = async () => {
            try {
                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${API_KEY}`
                );
                const data = await res.json();

                const dailyTemps = {};

                data.list.forEach(item => {
                    const date = item.dt_txt.split(" ")[0];
                    const hour = parseInt(item.dt_txt.split(" ")[1].split(":")[0]);

                    if (!dailyTemps[date]) {
                        dailyTemps[date] = { 
                            day: -Infinity, 
                            night: Infinity, 
                            weather: item.weather[0] 
                        };
                    }

                    if (hour >= 6 && hour <= 18) {
                        dailyTemps[date].day = Math.max(dailyTemps[date].day, item.main.temp);
                    } else {
                        dailyTemps[date].night = Math.min(dailyTemps[date].night, item.main.temp);
                    }
                });

                const dailyArray = Object.entries(dailyTemps).map(([date, temps]) => ({
                    date,
                    day: temps.day,
                    night: temps.night,
                    weather: temps.weather
                }));

                setForecast(dailyArray);

            } catch (err) {
                console.error("Errore fetch forecast: ", err);
            }
        };

        fetchForecast();
    }, [city]);

    const convertTemp = (temp) => {
        if (unit === 'C') return Math.round(temp);
        if (unit === 'F') return Math.round((temp * 9/5) + 32);
        if (unit === 'K') return Math.round(temp + 273.15);
    };

    const handleUnitToggle = () => {
        setUnit(prev => prev === 'C' ? 'F' : prev === 'F' ? 'K' : 'C');
    };

    if (!forecast.length) return null;

    return (
        <div className={`forecast-container ${theme}`}>
            {forecast.map((item, i) => {
                const date = new Date(item.date);
                const dayName = date.toLocaleDateString('it-IT', { weekday: 'long' });
                const icon = item.weather.icon;
                const description = item.weather.description;

                return (
                    <div className={`forecast-card ${theme}`} key={i}>
                        <strong>{dayName}</strong>
                        <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={description} />
                        <p className="temp" onClick={handleUnitToggle}>
                            {convertTemp(item.day)}° / {convertTemp(item.night)}° {unit}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default Forecast;