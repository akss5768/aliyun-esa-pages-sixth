import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './App.css';

const App = () => {
  const [particles, setParticles] = useState([]);
  const [gravity, setGravity] = useState(0.5);
  const [isSimulating, setIsSimulating] = useState(false);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 20, 40, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      setParticles(prev => prev.map(particle => {
        if (!isSimulating) return particle;

        let newParticle = { ...particle };
        newParticle.vy += gravity;
        newParticle.x += newParticle.vx;
        newParticle.y += newParticle.vy;

        if (newParticle.y + particle.radius > canvas.height) {
          newParticle.y = canvas.height - particle.radius;
          newParticle.vy *= -0.8;
        }
        if (newParticle.x + particle.radius > canvas.width) {
          newParticle.x = canvas.width - particle.radius;
          newParticle.vx *= -0.8;
        }
        if (newParticle.x - particle.radius < 0) {
          newParticle.x = particle.radius;
          newParticle.vx *= -0.8;
        }

        ctx.beginPath();
        ctx.arc(newParticle.x, newParticle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.strokeStyle = particle.glow;
        ctx.lineWidth = 2;
        ctx.stroke();

        return newParticle;
      }));

      if (isSimulating) {
        requestRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isSimulating, gravity]);

  const addParticle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const colors = ['#00ff88', '#00d4ff', '#ff6b6b', '#ffd93d', '#6bcb77'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    setParticles(prev => [...prev, {
      x: Math.random() * canvas.width,
      y: 50,
      vx: (Math.random() - 0.5) * 10,
      vy: 0,
      radius: 5 + Math.random() * 10,
      color: color,
      glow: color + '44'
    }]);
  };

  const clearParticles = () => {
    setParticles([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>⚛️ 粒子物理模拟</h1>
        <p>探索微观世界的奇妙运动</p>
      </header>

      <main className="main">
        <div className="canvas-container">
          <canvas ref={canvasRef} className="particle-canvas" />
          <div className="canvas-overlay">
            <div className="stats">
              <div className="stat">
                <span className="stat-label">粒子数量</span>
                <span className="stat-value">{particles.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">重力</span>
                <span className="stat-value">{gravity.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="controls">
          <div className="control-group">
            <label>重力强度</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={gravity}
              onChange={(e) => setGravity(parseFloat(e.target.value))}
            />
          </div>

          <div className="control-buttons">
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSimulating(!isSimulating)}
            >
              {isSimulating ? '⏸ 暂停' : '▶ 开始'}
            </motion.button>

            <motion.button
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addParticle}
            >
              + 添加粒子
            </motion.button>

            <motion.button
              className="btn btn-danger"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearParticles}
            >
              × 清空
            </motion.button>
          </div>
        </div>

        <div className="info">
          <h3>物理原理</h3>
          <p>粒子在重力作用下的运动遵循牛顿运动定律。粒子碰撞边界时会产生能量损失（弹性碰撞）。</p>
          <div className="formulas">
            <div className="formula">F = m × a</div>
            <div className="formula">v = v₀ + a × t</div>
            <div className="formula">s = v₀ × t + ½ × a × t²</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
