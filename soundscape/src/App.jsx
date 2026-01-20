import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './App.css';

const App = () => {
  const [waveIntensity, setWaveIntensity] = useState(50);
  const [waveSpeed, setWaveSpeed] = useState(50);
  const [colorMode, setColorMode] = useState('ocean');
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const colorSchemes = {
    ocean: {
      gradient: ['#001a33', '#003366', '#0066cc', '#0099ff'],
      wave: '#00ccff'
    },
    sunset: {
      gradient: ['#1a0a2e', '#2d1b4e', '#ff6b35', '#f7931e'],
      wave: '#ffab40'
    },
    forest: {
      gradient: ['#0d1b0a', '#1b3a18', '#2d5a27', '#3d7a52'],
      wave: '#4caf50'
    },
    aurora: {
      gradient: ['#0a0a1a', '#1a1a3a', '#2a4a6a', '#3a7a9a'],
      wave: '#00ff88'
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      const scheme = colorSchemes[colorMode];
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, scheme.gradient[0]);
      gradient.addColorStop(0.3, scheme.gradient[1]);
      gradient.addColorStop(0.7, scheme.gradient[2]);
      gradient.addColorStop(1, scheme.gradient[3]);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const numWaves = 5;
      for (let w = 0; w < numWaves; w++) {
        ctx.beginPath();
        const amplitude = (waveIntensity / 100) * 50 + (w * 10);
        const frequency = 0.01;
        const speed = (waveSpeed / 100) * 0.05;
        const phase = time * speed + w * 0.5;
        const alpha = 0.3 + (w * 0.15);

        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x++) {
          const y = canvas.height * 0.4 +
                    Math.sin(x * frequency + phase) * amplitude +
                    Math.sin(x * frequency * 2 + phase * 1.5) * amplitude * 0.5;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();

        ctx.fillStyle = `${scheme.wave}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      }

      time += 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [waveIntensity, waveSpeed, colorMode]);

  return (
    <div className="app">
      <header className="header">
        <h1>🌊 声音景观</h1>
        <p>沉浸在流动的视觉波浪中</p>
      </header>

      <div className="canvas-wrapper">
        <canvas ref={canvasRef} className="wave-canvas" />
        <div className="particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                y: [0, -100, 0],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="controls">
        <div className="control-section">
          <h3>🌊 波浪强度</h3>
          <input
            type="range"
            min="0"
            max="100"
            value={waveIntensity}
            onChange={(e) => setWaveIntensity(parseInt(e.target.value))}
          />
          <span>{waveIntensity}%</span>
        </div>

        <div className="control-section">
          <h3>⚡ 波浪速度</h3>
          <input
            type="range"
            min="0"
            max="100"
            value={waveSpeed}
            onChange={(e) => setWaveSpeed(parseInt(e.target.value))}
          />
          <span>{waveSpeed}%</span>
        </div>

        <div className="control-section">
          <h3>🎨 色彩模式</h3>
          <div className="color-modes">
            {Object.keys(colorSchemes).map(mode => (
              <motion.button
                key={mode}
                className={`color-mode-btn ${colorMode === mode ? 'active' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setColorMode(mode)}
                style={{ '--mode-color': colorSchemes[mode].gradient[2] }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>闭上眼睛，聆听内心的声音</p>
      </footer>
    </div>
  );
};

export default App;
