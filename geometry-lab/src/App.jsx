import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import './App.css';

// 拖动hook
const useDraggable = (initialPosition = { x: 0, y: 0 }) => {
  const position = useMotionValue(initialPosition.x);
  const yPosition = useMotionValue(initialPosition.y);

  const handleDrag = (event, info) => {
    position.set(info.point.x - initialPosition.x);
    yPosition.set(info.point.y - initialPosition.y);
  };

  const resetPosition = () => {
    position.set(initialPosition.x);
    yPosition.set(initialPosition.y);
  };

  return {
    x: position,
    y: yPosition,
    onDrag: handleDrag,
    resetPosition
  };
};

const App = () => {
  const [shapes, setShapes] = useState([]);
  const [theorems, setTheorems] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedTheorem, setSelectedTheorem] = useState(null);
  const [activeTab, setActiveTab] = useState('shapes');
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const canvasRef = useRef(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const shapeDetailRef = useRef(null);
  const theoremDetailRef = useRef(null);

  // 拖动状态
  const [shapeDragPosition, setShapeDragPosition] = useState({ x: 0, y: 0 });
  const [theoremDragPosition, setTheoremDragPosition] = useState({ x: 0, y: 0 });
  const [isShapeDraggable, setIsShapeDraggable] = useState(false);
  const [isTheoremDraggable, setIsTheoremDraggable] = useState(false);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 拖动处理函数
  const handleDragStart = (e, type) => {
    if (type === 'shape') {
      setIsShapeDraggable(true);
    } else {
      setIsTheoremDraggable(true);
    }
  };

  const handleDrag = (e, info, type) => {
    if (type === 'shape') {
      setShapeDragPosition({ x: info.delta.x + shapeDragPosition.x, y: info.delta.y + shapeDragPosition.y });
    } else {
      setTheoremDragPosition({ x: info.delta.x + theoremDragPosition.x, y: info.delta.y + theoremDragPosition.y });
    }
  };

  const handleDragEnd = (type) => {
    if (type === 'shape') {
      setIsShapeDraggable(false);
    } else {
      setIsTheoremDraggable(false);
    }
  };

  // 动态计算浮层样式
  const modalStyles = useMemo(() => {
    const { width, height } = windowSize;

    // 根据屏幕尺寸计算最佳宽度
    let modalWidth, modalPadding, modalFontSize, maxWidth;

    if (width < 480) {
      // 手机小屏
      modalWidth = width * 0.95;
      maxWidth = 400;
      modalPadding = '1.2rem';
      modalFontSize = { title: '1.6rem', body: '1rem', formula: '0.9rem' };
    } else if (width < 768) {
      // 手机大屏
      modalWidth = width * 0.9;
      maxWidth = 500;
      modalPadding = '1.5rem';
      modalFontSize = { title: '1.8rem', body: '1.05rem', formula: '1rem' };
    } else if (width < 1024) {
      // 平板
      modalWidth = width * 0.85;
      maxWidth = 700;
      modalPadding = '1.8rem';
      modalFontSize = { title: '2rem', body: '1.1rem', formula: '1rem' };
    } else {
      // 桌面
      modalWidth = width < 1200 ? width * 0.8 : width * 0.7;
      maxWidth = 700;
      modalPadding = '2rem';
      modalFontSize = { title: '2rem', body: '1.1rem', formula: '1rem' };
    }

    // 限制最大宽度
    modalWidth = Math.min(modalWidth, maxWidth);

    // 计算最大高度，留出边距
    const maxHeight = Math.min(height * 0.9, 800);

    // 计算左右边距（确保左右对称）
    const horizontalMargin = (width - modalWidth) / 2;
    const bottomMargin = (height - maxHeight) / 2;

    return {
      width: `${modalWidth}px`,
      padding: modalPadding,
      maxHeight,
      fontSize: modalFontSize,
      horizontalMargin,
      bottomMargin
    };
  }, [windowSize]);

  useEffect(() => {
    fetch('/data/shapes.json')
      .then(res => res.json())
      .then(data => {
        setShapes(data.shapes);
        setTheorems(data.theorems);
        setIsDataLoaded(true);
      })
      .catch(err => console.error('加载数据失败:', err));
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
      requestAnimationFrame(() => {
        drawShape(selectedShape, canvas);
      });
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
            transition={{ duration: 1 / animationSpeed, delay: i * 0.05 }}
          />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`v${i}`}
            className="grid-line vertical"
            style={{ left: `${i * 5}%` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1 / animationSpeed, delay: i * 0.05 }}
          />
        ))}
      </div>

      {/* 标题 */}
      <motion.div
        className="header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 / animationSpeed }}
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
        transition={{ duration: 0.8 / animationSpeed, delay: 0.2 / animationSpeed }}
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
          transition={{ duration: 0.6 / animationSpeed }}
        >
          {/* 图形网格 */}
          <div className="shapes-grid">
            {shapes.map((shape, index) => (
              <motion.div
                key={shape.id}
                className="shape-card"
                initial={{ opacity: 0, rotateX: 90 }}
                animate={{ opacity: 1, rotateX: 0 }}
                transition={{ duration: 0.6 / animationSpeed, delay: (index * 0.1) / animationSpeed }}
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
              <>
                <motion.div
                  className="modal-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedShape(null)}
                />
                <motion.div
                  className="shape-detail"
                  ref={shapeDetailRef}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: shapeDragPosition.x,
                    y: shapeDragPosition.y
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.3 / animationSpeed,
                    type: 'spring',
                    stiffness: 300,
                    damping: 25
                  }}
                  drag
                  dragConstraints={{
                    left: -modalStyles.horizontalMargin,
                    right: modalStyles.horizontalMargin,
                    top: -modalStyles.bottomMargin,
                    bottom: modalStyles.bottomMargin
                  }}
                  dragElastic={0.15}
                  dragMomentum={true}
                  dragTransition={{
                    power: 0.25,
                    timeConstant: 200
                  }}
                  onDragStart={() => handleDragStart(null, 'shape')}
                  onDrag={(e, info) => handleDrag(e, info, 'shape')}
                  onDragEnd={() => handleDragEnd('shape')}
                  style={{
                    '--shape-color': selectedShape.color,
                    '--modal-width': modalStyles.width,
                    '--modal-padding': modalStyles.padding,
                    '--modal-max-height': `${modalStyles.maxHeight}px`,
                    '--font-size-title': modalStyles.fontSize.title,
                    '--font-size-body': modalStyles.fontSize.body,
                    '--font-size-formula': modalStyles.fontSize.formula,
                    cursor: isShapeDraggable ? 'grabbing' : 'grab'
                  }}
                  layout
                >
                <button className="close-btn" onClick={() => setSelectedShape(null)}>✕</button>
                <div className="drag-hint">可拖动</div>
                <div className="shape-canvas-container">
                  <canvas
                    ref={canvasRef}
                    width={windowSize.width < 480 ? 240 : 300}
                    height={windowSize.width < 480 ? 240 : 300}
                  />
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
              </>
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
          transition={{ duration: 0.6 / animationSpeed }}
        >
          <div className="theorems-grid">
            {theorems.map((theorem, index) => (
              <motion.div
                key={theorem.id}
                className="theorem-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 / animationSpeed, delay: (index * 0.1) / animationSpeed }}
                whileHover={{ scale: 1.03, rotateZ: 2 }}
                onClick={() => setSelectedTheorem(theorem)}
                style={{ '--theorem-color': theorem.color }}
              >
                <div className="theorem-formula">
                  <motion.span
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3 / animationSpeed, repeat: Infinity }}
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
              <>
                <motion.div
                  className="modal-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedTheorem(null)}
                />
                <motion.div
                  className="theorem-detail"
                  ref={theoremDetailRef}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: theoremDragPosition.x,
                    y: theoremDragPosition.y
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.3 / animationSpeed,
                    type: 'spring',
                    stiffness: 300,
                    damping: 25
                  }}
                  drag
                  dragConstraints={{
                    left: -modalStyles.horizontalMargin,
                    right: modalStyles.horizontalMargin,
                    top: -modalStyles.bottomMargin,
                    bottom: modalStyles.bottomMargin
                  }}
                  dragElastic={0.15}
                  dragMomentum={true}
                  dragTransition={{
                    power: 0.25,
                    timeConstant: 200
                  }}
                  onDragStart={() => handleDragStart(null, 'theorem')}
                  onDrag={(e, info) => handleDrag(e, info, 'theorem')}
                  onDragEnd={() => handleDragEnd('theorem')}
                  style={{
                    '--theorem-color': selectedTheorem.color,
                    '--modal-width': modalStyles.width,
                    '--modal-padding': modalStyles.padding,
                    '--modal-max-height': `${modalStyles.maxHeight}px`,
                    '--font-size-title': modalStyles.fontSize.title,
                    '--font-size-body': modalStyles.fontSize.body,
                    '--font-size-formula': modalStyles.fontSize.formula,
                    cursor: isTheoremDraggable ? 'grabbing' : 'grab'
                  }}
                  layout
                >
                <button className="close-btn" onClick={() => setSelectedTheorem(null)}>✕</button>
                <div className="drag-hint">可拖动</div>
                <div className="theorem-detail-header">
                  <h2>{selectedTheorem.name}</h2>
                  <div className="theorem-formula-large">
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2 / animationSpeed, repeat: Infinity }}
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
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* 控制面板 */}
      <motion.div
        className="control-panel"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 / animationSpeed, delay: 0.4 / animationSpeed }}
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
