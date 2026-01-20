import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const App = () => {
  const [fonts, setFonts] = useState([]);
  const [principles, setPrinciples] = useState([]);
  const [selectedFont, setSelectedFont] = useState(null);
  const [customText, setCustomText] = useState('');
  const [currentView, setCurrentView] = useState('fonts');

  useEffect(() => {
    fetch('/data/fonts.json')
      .then(res => res.json())
      .then(data => {
        setFonts(data.fonts);
        setPrinciples(data.principles);
      });
  }, []);

  return (
    <div className="app">
      {/* 标题 */}
      <motion.header
        className="header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="logo">
          <span className="logo-a">A</span>
          <span className="logo-g">g</span>
        </div>
        <h1>Typography</h1>
        <p className="subtitle">字体排版艺术 · 极简主义</p>
      </motion.header>

      {/* 导航 */}
      <motion.nav
        className="nav"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <button
          className={`nav-btn ${currentView === 'fonts' ? 'active' : ''}`}
          onClick={() => setCurrentView('fonts')}
        >
          字体库
        </button>
        <button
          className={`nav-btn ${currentView === 'playground' ? 'active' : ''}`}
          onClick={() => setCurrentView('playground')}
        >
          体验区
        </button>
        <button
          className={`nav-btn ${currentView === 'principles' ? 'active' : ''}`}
          onClick={() => setCurrentView('principles')}
        >
          设计原则
        </button>
      </motion.nav>

      {/* 主内容 */}
      <main className="main">
        {currentView === 'fonts' && (
          <motion.div
            className="fonts-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {fonts.map((font, index) => (
              <motion.div
                key={font.id}
                className="font-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedFont(font)}
              >
                <div className="font-preview" style={{ fontFamily: font.family }}>
                  <span className="font-sample">{font.sample}</span>
                </div>
                <div className="font-info">
                  <h3 style={{ fontFamily: font.family }}>{font.name}</h3>
                  <p className="font-meta">
                    <span className="tag">{font.category}</span>
                    <span className="year">{font.year}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {currentView === 'playground' && (
          <motion.div
            className="playground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="playground-controls">
              <textarea
                placeholder="输入文字体验不同字体..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="text-input"
              />
            </div>
            <div className="fonts-preview">
              {fonts.map((font, index) => (
                <motion.div
                  key={font.id}
                  className="font-playground-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  style={{ fontFamily: font.family }}
                >
                  <div className="font-name">{font.name}</div>
                  <div className="font-text">
                    {customText || font.sample}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {currentView === 'principles' && (
          <motion.div
            className="principles-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {principles.map((principle, index) => (
              <motion.div
                key={principle.id}
                className="principle-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="principle-number">{String(index + 1).padStart(2, '0')}</div>
                <h3 className="principle-name">{principle.name}</h3>
                <p className="principle-description">{principle.description}</p>
                <div className="principle-example">
                  <span className="example-label">示例：</span>
                  <span className="example-value">{principle.example}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* 字体详情弹窗 */}
      <AnimatePresence>
        {selectedFont && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFont(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setSelectedFont(null)}>✕</button>

              <div className="modal-header" style={{ fontFamily: selectedFont.family }}>
                <h1 className="modal-title">{selectedFont.name}</h1>
                <p className="modal-subtitle">{selectedFont.family}</p>
              </div>

              <div className="modal-sample" style={{ fontFamily: selectedFont.family }}>
                {selectedFont.sample}
              </div>

              <div className="modal-info">
                <div className="info-row">
                  <span className="info-label">分类</span>
                  <span className="info-value">{selectedFont.category}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">发布年份</span>
                  <span className="info-value">{selectedFont.year}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">设计师</span>
                  <span className="info-value">{selectedFont.designer}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">特点</span>
                  <span className="info-value">{selectedFont.characteristics}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">氛围</span>
                  <span className="info-value">{selectedFont.mood}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">适用场景</span>
                  <span className="info-value">{selectedFont.usage}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">知名使用</span>
                  <span className="info-value">{selectedFont.famous}</span>
                </div>
              </div>

              <div className="modal-description">
                <h3>关于</h3>
                <p>{selectedFont.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
