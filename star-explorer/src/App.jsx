import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const App = () => {
  const [selectedStar, setSelectedStar] = useState(null);
  const [selectedConstellation, setSelectedConstellation] = useState(null);
  const [stars, setStars] = useState([]);
  const [constellations, setConstellations] = useState([]);
  const [hoveredStar, setHoveredStar] = useState(null);

  useEffect(() => {
    fetch('/data/stars.json')
      .then(res => res.json())
      .then(data => {
        setStars(data.stars);
        setConstellations(data.constellations);
      });
  }, []);

  const generateBackgroundStars = () => {
    return Array.from({ length: 200 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2
    }));
  };

  const backgroundStars = generateBackgroundStars();

  return (
    <div className="app">
      {/* 背景星星 */}
      {backgroundStars.map(star => (
        <motion.div
          key={star.id}
          className="background-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      ))}

      {/* 标题 */}
      <motion.div
        className="title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>✦ 星空探索者 ✦</h1>
        <p>探索宇宙的奥秘，感受星辰的魅力</p>
      </motion.div>

      {/* 主内容区域 */}
      <div className="main-content">
        {/* 星座列表 */}
        <motion.div
          className="constellation-list"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2>星座导航</h2>
          <div className="constellation-items">
            {constellations.map(constellation => (
              <motion.div
                key={constellation.id}
                className={`constellation-item ${selectedConstellation?.id === constellation.id ? 'active' : ''}`}
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedConstellation(constellation)}
              >
                <div className="constellation-icon">★</div>
                <div className="constellation-info">
                  <h3>{constellation.name}</h3>
                  <p>{constellation.season}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 星星展示区 */}
        <motion.div
          className="star-display"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h2>恒星展示</h2>
          <div className="stars-grid">
            {stars.map(star => (
              <motion.div
                key={star.id}
                className={`star-card ${selectedStar?.id === star.id ? 'selected' : ''}`}
                whileHover={{ scale: 1.1, rotateY: 10 }}
                onClick={() => setSelectedStar(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                style={{
                  '--star-color': star.color,
                  '--star-glow': `${star.color}66`
                }}
              >
                <motion.div
                  className="star-visual"
                  animate={{
                    boxShadow: hoveredStar?.id === star.id
                      ? `0 0 30px ${star.color}`
                      : `0 0 15px ${star.color}`
                  }}
                >
                  <span>✦</span>
                </motion.div>
                <div className="star-name">{star.name}</div>
                <div className="star-constellation">{star.constellation}</div>
                <motion.div
                  className="brightness-indicator"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.abs(star.brightness) * 20}%` }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 详情面板 */}
      <AnimatePresence>
        {selectedStar && (
          <motion.div
            className="star-detail"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
          >
            <button className="close-btn" onClick={() => setSelectedStar(null)}>×</button>
            <motion.div
              className="detail-star"
              animate={{
                rotate: 360,
                boxShadow: `0 0 50px ${selectedStar.color}, 0 0 100px ${selectedStar.color}66`
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <span>✦</span>
            </motion.div>
            <h2 style={{ color: selectedStar.color }}>{selectedStar.name}</h2>
            <div className="detail-info">
              <div className="info-item">
                <span className="label">星座</span>
                <span className="value">{selectedStar.constellation}</span>
              </div>
              <div className="info-item">
                <span className="label">距离</span>
                <span className="value">{selectedStar.distance} 光年</span>
              </div>
              <div className="info-item">
                <span className="label">亮度</span>
                <span className="value">{selectedStar.brightness}</span>
              </div>
              <div className="info-item">
                <span className="label">类型</span>
                <span className="value">{selectedStar.type}</span>
              </div>
              <div className="info-item">
                <span className="label">质量</span>
                <span className="value">{selectedStar.mass} 太阳质量</span>
              </div>
              <div className="info-item">
                <span className="label">表面温度</span>
                <span className="value">{selectedStar.temperature.toLocaleString()} K</span>
              </div>
              <div className="info-item">
                <span className="label">年龄</span>
                <span className="value">{(selectedStar.age / 1000000).toFixed(0)} 百万年</span>
              </div>
            </div>
          </motion.div>
        )}

        {selectedConstellation && (
          <motion.div
            className="constellation-detail"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <button className="close-btn" onClick={() => setSelectedConstellation(null)}>×</button>
            <h2>✦ {selectedConstellation.name}</h2>
            <div className="constellation-detail-info">
              <p className="story">{selectedConstellation.story}</p>
              <div className="detail-items">
                <div className="detail-item">
                  <span className="item-label">主要恒星</span>
                  <span className="item-value">{selectedConstellation.mainStar}</span>
                </div>
                <div className="detail-item">
                  <span className="item-label">恒星数量</span>
                  <span className="item-value">{selectedConstellation.starsCount} 颗</span>
                </div>
                <div className="detail-item">
                  <span className="item-label">最佳观测季节</span>
                  <span className="item-value">{selectedConstellation.season}</span>
                </div>
                <div className="detail-item">
                  <span className="item-label">最佳观测月份</span>
                  <span className="item-value">{selectedConstellation.bestViewMonth} 月</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
