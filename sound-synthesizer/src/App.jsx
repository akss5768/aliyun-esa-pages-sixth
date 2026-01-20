import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './App.css';

const App = () => {
  const [activeNotes, setActiveNotes] = useState([]);

  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C5', 'D5', 'E5', 'F5', 'G5'];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1'];

  const playNote = (note, color) => {
    setActiveNotes([...activeNotes, { note, color, id: Date.now() }]);
    setTimeout(() => {
      setActiveNotes(prev => prev.filter(n => n.id !== Date.now()));
    }, 500);
  };

  return (
    <div className="app">
      <div className="pattern-background" />
      <header className="header">
        <h1>🎵 音效合成器</h1>
        <p>点击键盘或按下对应按键播放音符</p>
      </header>

      <main className="synthesizer">
        <div className="keyboard">
          {notes.map((note, index) => (
            <motion.button
              key={note}
              className={`key ${activeNotes.find(n => n.note === note) ? 'active' : ''}`}
              style={{ '--key-color': colors[index] }}
              whileTap={{ scale: 0.95 }}
              onClick={() => playNote(note, colors[index])}
            >
              <span className="note-name">{note}</span>
              <span className="key-label">{index + 1}</span>
            </motion.button>
          ))}
        </div>

        <div className="visualizer">
          {activeNotes.map((item) => (
            <motion.div
              key={item.id}
              className="visualizer-bar"
              style={{ background: item.color }}
              initial={{ height: 0 }}
              animate={{ height: [0, 100, 0] }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>

        <div className="presets">
          <h3>预设音效</h3>
          {['钢琴', '合成器', '电子琴', '风琴'].map((preset, index) => (
            <motion.button
              key={preset}
              className="preset-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ '--preset-color': colors[index % colors.length] }}
            >
              {preset}
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
