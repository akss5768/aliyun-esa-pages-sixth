import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const App = () => {
  const [palettes, setPalettes] = useState([]);
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [copiedColor, setCopiedColor] = useState(null);

  useEffect(() => {
    fetch('/data/colors.json')
      .then(res => res.json())
      .then(data => setPalettes(data.colorPalettes));
  }, []);

  const copyColor = (color) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>✨ 色彩情绪板</h1>
        <p>发现色彩的情感，创造美丽的搭配</p>
      </header>

      <main className="main">
        <div className="palettes-grid">
          {palettes.map((palette, index) => (
            <motion.div
              key={palette.id}
              className="palette-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedPalette(palette)}
            >
              <div className="palette-colors">
                {palette.colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="palette-color"
                    style={{ background: color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      copyColor(color);
                    }}
                  >
                    {copiedColor === color && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="copy-indicator"
                      >
                        ✓
                      </motion.span>
                    )}
                  </div>
                ))}
              </div>
              <div className="palette-info">
                <h3>{palette.name}</h3>
                <p>{palette.mood}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {selectedPalette && (
          <motion.div
            className="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPalette(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setSelectedPalette(null)}>×</button>
              <h2>{selectedPalette.name}</h2>
              <p className="mood">{selectedPalette.mood}</p>
              <div className="expanded-colors">
                {selectedPalette.colors.map((color, index) => (
                  <motion.div
                    key={index}
                    className="expanded-color"
                    style={{ background: color }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => copyColor(color)}
                  >
                    <span className="color-code">{color}</span>
                    {copiedColor === color && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="copy-check"
                      >
                        已复制
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {copiedColor && (
        <motion.div
          className="toast"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
        >
          已复制 {copiedColor}
        </motion.div>
      )}
    </div>
  );
};

export default App;
