import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const App = () => {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/data/plants.json')
      .then(res => res.json())
      .then(data => {
        setPlants(data.plants);
        setCategories(data.categories);
      });
  }, []);

  const filteredPlants = plants.filter(plant => {
    const matchesCategory = selectedCategory === '全部' || plant.category === selectedCategory;
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app">
      {/* 背景装饰 */}
      <div className="background-decoration">
        <motion.div
          className="leaf leaf-1"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="leaf leaf-2"
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="leaf leaf-3"
          animate={{ rotate: 360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* 标题区 */}
      <motion.div
        className="header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="header-icon">🌿</div>
        <h1>植物百科</h1>
        <p>探索自然之美，了解植物世界</p>
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
            placeholder="搜索植物名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="category-filter">
          {categories.map(cat => (
            <motion.button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.name ? 'active' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 植物卡片网格 */}
      <motion.div
        className="plants-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {filteredPlants.map((plant, index) => (
          <motion.div
            key={plant.id}
            className="plant-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => setSelectedPlant(plant)}
            style={{
              '--plant-color': plant.color,
              '--leaf-color': plant.leafColor
            }}
          >
            <div className="plant-visual">
              <motion.div
                className="plant-icon"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {plant.category === '花卉' && '🌸'}
                {plant.category === '香草' && '🌱'}
                {plant.category === '观叶植物' && '🍃'}
                {plant.category === '多肉' && '🌵'}
                {plant.category === '灌木' && '🌳'}
              </motion.div>
            </div>
            <div className="plant-info">
              <h3>{plant.name}</h3>
              <p className="scientific-name">{plant.scientificName}</p>
              <div className="tags">
                <span className="tag">{plant.category}</span>
                <span className="tag">{plant.difficulty}</span>
              </div>
            </div>
            <motion.div
              className="plant-color-bar"
              style={{ background: `linear-gradient(90deg, ${plant.color}, ${plant.leafColor})` }}
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 0.8 }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* 植物详情弹窗 */}
      <AnimatePresence>
        {selectedPlant && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPlant(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              style={{ '--plant-color': selectedPlant.color }}
            >
              <button className="close-btn" onClick={() => setSelectedPlant(null)}>✕</button>
              <div className="modal-header">
                <motion.div
                  className="modal-plant-icon"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {selectedPlant.category === '花卉' && '🌸'}
                  {selectedPlant.category === '香草' && '🌱'}
                  {selectedPlant.category === '观叶植物' && '🍃'}
                  {selectedPlant.category === '多肉' && '🌵'}
                  {selectedPlant.category === '灌木' && '🌳'}
                </motion.div>
                <h2>{selectedPlant.name}</h2>
                <p className="modal-scientific-name">{selectedPlant.scientificName}</p>
              </div>
              <div className="modal-body">
                <div className="description">
                  <h3>🌱 植物介绍</h3>
                  <p>{selectedPlant.description}</p>
                </div>
                <div className="care-tips">
                  <h3>💡 养护贴士</h3>
                  <p>{selectedPlant.tips}</p>
                </div>
                <div className="plant-stats">
                  <div className="stat">
                    <span className="stat-label">产地</span>
                    <span className="stat-value">{selectedPlant.origin}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">高度</span>
                    <span className="stat-value">{selectedPlant.height}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">花期</span>
                    <span className="stat-value">{selectedPlant.bloomPeriod}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">需水量</span>
                    <span className="stat-value">{selectedPlant.waterNeed}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">光照</span>
                    <span className="stat-value">{selectedPlant.sunlight}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">难度</span>
                    <span className="stat-value">{selectedPlant.difficulty}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
