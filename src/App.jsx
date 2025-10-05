import { useState, useEffect } from 'react';
import './css/App.css';
import SearchBar from './SearchBar';
import Weather from './Weather';
import Forecast from './Forecast';

function App() {
  const [theme, setTheme] = useState('dark');
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    const hour = new Date().getHours();
    setTheme(hour >= 6 && hour < 18 ? 'light' : 'dark');
  }, []);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <div className={`Main ${theme}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {theme === 'dark' ? (
            <>
              <ion-icon name="sunny-sharp" class="icon"></ion-icon> Light Mode
            </>
          ) : (
            <>
              <ion-icon name="moon-sharp" class="icon"></ion-icon> Dark Mode
            </>
          )}
        </button>
      </div>

      <SearchBar theme={theme} onCitySelect={setSelectedCity}></SearchBar>

      {selectedCity && (
        <>
          <Weather city={selectedCity} theme={theme} />
          <Forecast city={selectedCity} theme={theme} />
        </>
      )}
    </div>
  );
}

export default App;