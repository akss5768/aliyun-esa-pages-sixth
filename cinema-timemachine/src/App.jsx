import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDecade, setSelectedDecade] = useState('全部');

  useEffect(() => {
    fetch('/data/movies.json')
      .then(res => res.json())
      .then(data => setMovies(data.movies));
  }, []);

  const decades = ['全部', '1970s', '1980s', '1990s', '2000s', '2010s'];

  const filteredMovies = movies.filter(movie => {
    if (selectedDecade === '全部') return true;
    const decade = selectedDecade;
    const movieDecade = `${Math.floor(movie.year / 10) * 10}s`;
    return movieDecade === decade;
  });

  return (
    <div className="app">
      <div className="film-grain" />
      <div className="vignette" />

      <header className="header">
        <div className="film-strip" />
        <h1>🎬 电影时光机</h1>
        <p className="subtitle">穿越电影史，重温经典时刻</p>
        <div className="film-strip" />
      </header>

      <nav className="decade-nav">
        {decades.map(decade => (
          <motion.button
            key={decade}
            className={`decade-btn ${selectedDecade === decade ? 'active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedDecade(decade)}
          >
            {decade}
          </motion.button>
        ))}
      </nav>

      <main className="main">
        <div className="movies-grid">
          {filteredMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              className="movie-card"
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateZ: 2 }}
              onClick={() => setSelectedMovie(movie)}
              style={{ '--poster-color': movie.poster }}
            >
              <div className="poster" style={{ background: movie.poster }}>
                <div className="poster-content">
                  <div className="poster-title">{movie.title}</div>
                  <div className="poster-year">{movie.year}</div>
                </div>
              </div>
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p className="director">{movie.director}</p>
                <div className="meta">
                  <span className="genre">{movie.genre}</span>
                  <span className="rating">★ {movie.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            className="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMovie(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, y: 100, rotateX: -20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: 100, rotateX: -20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setSelectedMovie(null)}>×</button>
              <div className="modal-poster" style={{ background: selectedMovie.poster }}>
                <div className="modal-poster-content">
                  <h2>{selectedMovie.title}</h2>
                  <p>{selectedMovie.year}</p>
                </div>
              </div>
              <div className="modal-info">
                <div className="modal-header">
                  <h1>{selectedMovie.title}</h1>
                  <p className="modal-subtitle">{selectedMovie.year} · {selectedMovie.genre}</p>
                </div>

                <div className="modal-quote">
                  <span className="quote-mark">"</span>
                  <p>{selectedMovie.quote}</p>
                  <span className="quote-mark">"</span>
                </div>

                <div className="modal-details">
                  <div className="detail-item">
                    <span className="detail-label">导演</span>
                    <span className="detail-value">{selectedMovie.director}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">片长</span>
                    <span className="detail-value">{selectedMovie.duration}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">评分</span>
                    <span className="detail-value rating">★ {selectedMovie.rating}</span>
                  </div>
                </div>

                <div className="modal-description">
                  <h3>剧情简介</h3>
                  <p>{selectedMovie.description}</p>
                </div>

                <div className="modal-awards">
                  <h3>获奖记录</h3>
                  {selectedMovie.awards.map((award, index) => (
                    <div key={index} className="award">🏆 {award}</div>
                  ))}
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
