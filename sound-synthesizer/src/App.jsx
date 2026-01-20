import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './App.css';

const App = () => {
  const [activeNotes, setActiveNotes] = useState([]);
  const audioContextRef = useRef(null);

  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C5', 'D5', 'E5', 'F5', 'G5'];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1'];

  const noteFrequencies = {
    'C': 261.63,
    'D': 293.66,
    'E': 329.63,
    'F': 349.23,
    'G': 392.00,
    'A': 440.00,
    'B': 493.88,
    'C5': 523.25,
    'D5': 587.33,
    'E5': 659.25,
    'F5': 698.46,
    'G5': 783.99
  };

  const playTone = (frequency) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const playNote = (note, color) => {
    const frequency = noteFrequencies[note];
    playTone(frequency);

    const noteId = Date.now();
    setActiveNotes([...activeNotes, { note, color, id: noteId }]);
    setTimeout(() => {
      setActiveNotes(prev => prev.filter(n => n.id !== noteId));
    }, 500);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      const keyNum = parseInt(key);
      if (keyNum >= 1 && keyNum <= 12) {
        const index = keyNum - 1;
        playNote(notes[index], colors[index]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNotes]);

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
