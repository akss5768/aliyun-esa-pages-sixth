import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const App = () => {
  const [cities, setCities] = useState([]);
  const [continents, setContinents] = useState([]);
  const [selectedContinent, setSelectedContinent] = useState('全部');
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('grid');

  useEffect(() => {
    fetch('/data/cities.json')
      .then(res => res.json())
      .then(data => {
        setCities(data.cities);
        setContinents(data.continents);
      });
  }, []);

  const filteredCities = cities.filter(city => {
    const matchesContinent = selectedContinent === '全部' || city.continent === selectedContinent;
    const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          city.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          city.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesContinent && matchesSearch;
  });

  const getLocalTime = (timezone) => {
    const now = new Date();
    const offset = parseInt(timezone.replace('UTC', '').replace('+', '')) || 0;
    const sign = timezone.includes('+') ? 1 : -1;
    const localTime = new Date(now.getTime() + offset * 3600000 * sign);
    return localTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="app">
      {/* 地图背景 */}
      <div className="map-background">
        <motion.div
          className="map-pattern"
          animate={{ backgroundPosition: ['0 0', '100px 100px'] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* 标题 */}
      <motion.div
        className="header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="globe-icon">🌍</div>
        <h1>世界城市探索</h1>
        <p>发现全球魅力城市，体验世界文化之美</p>
      </motion.div>

      {/* 搜索和筛选区 */}
      <motion.div
        className="search-filter"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索城市名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="view-toggle">
          <motion.button
            className={`view-btn ${currentView === 'grid' ? 'active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('grid')}
          >
            ⊞ 网格
          </motion.button>
          <motion.button
            className={`view-btn ${currentView === 'list' ? 'active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('list')}
          >
            ☰ 列表
          </motion.button>
        </div>
        <div className="continent-filter">
          {continents.map(continent => (
            <motion.button
              key={continent.id}
              className={`continent-btn ${selectedContinent === continent.name ? 'active' : ''}`}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedContinent(continent.name)}
            >
              <span className="continent-icon">{continent.icon}</span>
              <span className="continent-name">{continent.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 城市内容 */}
      <motion.div
        className="content-area"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {currentView === 'grid' ? (
          <div className="cities-grid">
            {filteredCities.map((city, index) => (
              <motion.div
                key={city.id}
                className="city-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => setSelectedCity(city)}
              >
                <div className="city-flag">
                  <span>{getFlagByCountry(city.country)}</span>
                </div>
                <div className="city-info">
                  <h3>{city.name}</h3>
                  <p className="english-name">{city.englishName}</p>
                  <div className="city-meta">
                    <span className="meta-item">🏳️ {city.country}</span>
                    <span className="meta-item">👥 {(city.population / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
                <div className="city-time">
                  <span className="time-icon">🕐</span>
                  <span className="time-value">{getLocalTime(city.timezone)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="cities-list">
            {filteredCities.map((city, index) => (
              <motion.div
                key={city.id}
                className="city-list-item"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ x: 10 }}
                onClick={() => setSelectedCity(city)}
              >
                <div className="list-flag">{getFlagByCountry(city.country)}</div>
                <div className="list-info">
                  <h3>{city.name}</h3>
                  <p>{city.country} • {city.continent}</p>
                </div>
                <div className="list-population">{(city.population / 1000000).toFixed(1)}M</div>
                <div className="list-time">{getLocalTime(city.timezone)}</div>
                <div className="list-arrow">→</div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* 城市详情 */}
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            className="city-detail-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCity(null)}
          >
            <motion.div
              className="city-detail-content"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setSelectedCity(null)}>✕</button>
              <div className="detail-header">
                <motion.div
                  className="detail-flag"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {getFlagByCountry(selectedCity.country)}
                </motion.div>
                <h1>{selectedCity.name}</h1>
                <p className="detail-english-name">{selectedCity.englishName}</p>
              </div>
              <div className="detail-description">
                <p>{selectedCity.description}</p>
              </div>
              <div className="detail-stats">
                <div className="stat-card">
                  <span className="stat-icon">👥</span>
                  <div className="stat-info">
                    <span className="stat-label">人口</span>
                    <span className="stat-value">{selectedCity.population.toLocaleString()}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">🕐</span>
                  <div className="stat-info">
                    <span className="stat-label">时区</span>
                    <span className="stat-value">{selectedCity.timezone}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">💰</span>
                  <div className="stat-info">
                    <span className="stat-label">货币</span>
                    <span className="stat-value">{selectedCity.currency}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">🌡️</span>
                  <div className="stat-info">
                    <span className="stat-label">气候</span>
                    <span className="stat-value">{selectedCity.climate}</span>
                  </div>
                </div>
              </div>
              <div className="landmarks-section">
                <h3>🏛️ 著名地标</h3>
                <div className="landmarks-list">
                  {selectedCity.landmarks.map((landmark, index) => (
                    <motion.div
                      key={index}
                      className="landmark-item"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span>📍</span>
                      <span>{landmark}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">最佳旅游季节</span>
                  <span className="info-value">{selectedCity.bestSeason}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">语言</span>
                  <span className="info-value">{selectedCity.language}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">著名特色</span>
                  <span className="info-value">{selectedCity.famousFor}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 根据国家返回国旗emoji
const getFlagByCountry = (country) => {
  const flagMap = {
    '日本': '🇯🇵',
    '法国': '🇫🇷',
    '美国': '🇺🇸',
    '澳大利亚': '🇦🇺',
    '埃及': '🇪🇬',
    '巴西': '🇧🇷',
    '阿联酋': '🇦🇪',
    '英国': '🇬🇧'
  };
  return flagMap[country] || '🏳️';
};

export default App;
