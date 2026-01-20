import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const App = () => {
  const [shapes, setShapes] = useState([]);
  const [theorems, setTheorems] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedTheorem, setSelectedTheorem] = useState(null);
  const [activeTab, setActiveTab] = useState('shapes');
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetch('/data/shapes.json')
      .then(res => res.json())
      .then(data => {
        setShapes(data.shapes);
        setTheorems(data.theorems);
      });
  }, []);

  const drawShape = (shape, canvas) => {
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = Math.min(canvas.width, canvas.height) * 0.35;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 3;
    ctx.fillStyle = shape.color + '33';

    if (shape.category === '圆形') {
      if (shape.name === '圆形') {
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (shape.name === '椭圆') {
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, size * 1.3, size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    } else if (shape.category === '立体图形') {
      draw3DShape(ctx, shape, centerX, centerY, size);
    } else {
      drawPolygon(ctx, shape.sides, centerX, centerY, size);
    }
  };

  const drawPolygon = (ctx, sides, centerX, centerY, size) => {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
      const x = centerX + size * Math.cos(angle);
      const y = centerY + size * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const draw3DShape = (ctx, shape, centerX, centerY, size) => {
    const offset = size * 0.3;

    if (shape.name === '正四面体') {
      // 绘制正四面体（简化版）
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - size);
      ctx.lineTo(centerX + size * 0.866, centerY + size * 0.5);
      ctx.lineTo(centerX - size * 0.866, centerY + size * 0.5);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX, centerY - size);
      ctx.lineTo(centerX, centerY + size * 0.2);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + size * 0.866, centerY + size * 0.5);
      ctx.lineTo(centerX, centerY + size * 0.2);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX - size * 0.866, centerY + size * 0.5);
      ctx.lineTo(centerX, centerY + size * 0.2);
      ctx.closePath();
      ctx.stroke();
    } else if (shape.name === '立方体') {
      // 绘制立方体
      ctx.strokeRect(centerX - size * 0.5, centerY - size * 0.5, size, size);

      ctx.beginPath();
      ctx.moveTo(centerX - size * 0.5, centerY - size * 0.5);
      ctx.lineTo(centerX - size * 0.5 + offset, centerY - size * 0.5 - offset);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + size * 0.5, centerY - size * 0.5);
      ctx.lineTo(centerX + size * 0.5 + offset, centerY - size * 0.5 - offset);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX - size * 0.5, centerY + size * 0.5);
      ctx.lineTo(centerX - size * 0.5 + offset, centerY + size * 0.5 - offset);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + size * 0.5, centerY + size * 0.5);
      ctx.lineTo(centerX + size * 0.5 + offset, centerY + size * 0.5 - offset);
      ctx.stroke();

      ctx.strokeRect(centerX - size * 0.5 + offset, centerY - size * 0.5 - offset, size, size);
    } else if (shape.name === '球体') {
      ctx.beginPath();
      ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(centerX - size * 0.3, centerY, size * 0.2, size * 0.1, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(centerX, centerY - size * 0.3, size * 0.2, size * 0.1, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  useEffect(() => {
    if (selectedShape && canvasRef.current) {
      const canvas = canvasRef.current;
      drawShape(selectedShape, canvas);
    }
  }, [selectedShape]);

  return (
    <div className="app">
      {/* 背景网格 */}
      <div className="grid-background">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="grid-line horizontal"
            style={{ top: `${i * 5}%` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: i * 0.05 }}
          />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`v${i}`}
            className="grid-line vertical"
            style={{ left: `${i * 5}%` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1, delay: i * 0.05 }}
          />
        ))}
      </div>

      {/* 标题 */}
      <motion.div
        className="header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="geometric-icon">◈</div>
        <h1>数学几何实验室</h1>
        <p>探索几何之美，领略数学之妙</p>
      </motion.div>

      {/* 选项卡 */}
      <motion.div
        className="tabs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.button
          className={`tab-btn ${activeTab === 'shapes' ? 'active' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('shapes')}
        >
          ◇ 图形展示
        </motion.button>
        <motion.button
          className={`tab-btn ${activeTab === 'theorems' ? 'active' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('theorems')}
        >
          ◆ 定理探索
        </motion.button>
      </motion.div>

      {/* 图形展示区 */}
      {activeTab === 'shapes' && (
        <motion.div
          className="content-area"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* 图形网格 */}
          <div className="shapes-grid">
            {shapes.map((shape, index) => (
              <motion.div
                key={shape.id}
                className="shape-card"
                initial={{ opacity: 0, rotateX: 90 }}
                animate={{ opacity: 1, rotateX: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotateY: 10 }}
                onClick={() => setSelectedShape(shape)}
                style={{ '--shape-color': shape.color }}
              >
                <div className="shape-preview">
                  {shape.category === '圆形' ? '○' : '◇'}
                </div>
                <h3>{shape.name}</h3>
                <span className="shape-category">{shape.category}</span>
              </motion.div>
            ))}
          </div>

          {/* 图形详情 */}
          <AnimatePresence>
            {selectedShape && (
              <motion.div
                className="shape-detail"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{ '--shape-color': selectedShape.color }}
              >
                <button className="close-btn" onClick={() => setSelectedShape(null)}>✕</button>
                <div className="shape-canvas-container">
                  <canvas ref={canvasRef} width={300} height={300} />
                </div>
                <h2>{selectedShape.name}</h2>
                <p className="shape-description">{selectedShape.description}</p>
                <div className="shape-formulas">
                  <div className="formula-card">
                    <span className="formula-label">面积公式</span>
                    <span className="formula-value">{selectedShape.formula}</span>
                  </div>
                  <div className="formula-card">
                    <span className="formula-label">{selectedShape.category === '立体图形' ? '体积公式' : '周长公式'}</span>
                    <span className="formula-value">{selectedShape.perimeter}</span>
                  </div>
                </div>
                <div className="fun-fact">
                  <span className="fact-icon">💡</span>
                  <p>{selectedShape.funFact}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* 定理探索区 */}
      {activeTab === 'theorems' && (
        <motion.div
          className="content-area"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="theorems-grid">
            {theorems.map((theorem, index) => (
              <motion.div
                key={theorem.id}
                className="theorem-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, rotateZ: 2 }}
                onClick={() => setSelectedTheorem(theorem)}
                style={{ '--theorem-color': theorem.color }}
              >
                <div className="theorem-formula">
                  <motion.span
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {theorem.formula}
                  </motion.span>
                </div>
                <h3>{theorem.name}</h3>
                <p>{theorem.description}</p>
              </motion.div>
            ))}
          </div>

          {/* 定理详情 */}
          <AnimatePresence>
            {selectedTheorem && (
              <motion.div
                className="theorem-detail"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                style={{ '--theorem-color': selectedTheorem.color }}
              >
                <button className="close-btn" onClick={() => setSelectedTheorem(null)}>✕</button>
                <div className="theorem-detail-header">
                  <h2>{selectedTheorem.name}</h2>
                  <div className="theorem-formula-large">
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {selectedTheorem.formula}
                    </motion.span>
                  </div>
                </div>
                <div className="theorem-detail-content">
                  <div className="description-section">
                    <h3>定理说明</h3>
                    <p>{selectedTheorem.description}</p>
                  </div>
                  <div className="example-section">
                    <h3>示例</h3>
                    <p>{selectedTheorem.example}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* 控制面板 */}
      <motion.div
        className="control-panel"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <label>动画速度</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
        />
        <span>{animationSpeed}x</span>
      </motion.div>
    </div>
  );
};

export default App;
