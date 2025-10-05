import './css/SearchBar.css';
import { useState } from 'react';

function SearchBar({ theme, onCitySelect }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = 'API_KEY_OPENWEATHERMAP';

  const fetchCities = async (query) => {
    if (!query || query.length < 2) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      const data = await res.json();

      if (data.length === 0) {
        setError('Nessuna città trovata');
        setSuggestions([]);
      } else {
        setSuggestions(data);
      }
    } catch (err) {
      setError('Errore durante il recupero delle città');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setInput(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchCities(input);
  }

  const handleSearch = () => fetchCities(input);

  const handleSelect = (city) => {
    onCitySelect({
      name: city.name,
      lat: city.lat,
      lon: city.lon,
      country: city.country,
      state: city.state
    });
    setInput(city.name);
    setSuggestions([]);
  };

  return (
    <div className={`search-bar-container ${theme}`}>
      <div className="search-bar">
        <input 
          type="search"
          className="search-input"
          placeholder="Cerca la tua città"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button className="search-button" onClick={handleSearch}>
          <ion-icon name="search-sharp"></ion-icon>
        </button>
      </div>
      {loading && <p className="loading-text">Caricamento...</p>}
      {error && <p className="error-text">{error}</p>}

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((city, i) => (
            <li key={i} onClick={() => handleSelect(city)}>
              {city.name}
              {city.state ? `, ${city.state}` : ''}
              {city.country ? `, ${city.country}` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;