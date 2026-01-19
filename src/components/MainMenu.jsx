import { useState } from 'react';
import { PIECE_IMAGES } from '../utils/chessLogic';
import { BOARD_THEMES, PIECE_THEMES } from '../utils/theme';
import './MainMenu.css';

const DIFFICULTY_OPTIONS = [
    { id: 'easy', name: 'Kolay', emoji: '🌱', desc: 'Yeni başlayanlar için' },
    { id: 'medium', name: 'Orta', emoji: '🎯', desc: 'Dengeli zorluk' },
    { id: 'hard', name: 'Zor', emoji: '🔥', desc: 'Tecrübeli oyuncular için' }
];

const TIME_OPTIONS = [
    { id: 'untimed', name: 'Süresiz', seconds: 0, emoji: '♾️' },
    { id: 'bullet1', name: '1 Dakika', seconds: 60, emoji: '⚡' },
    { id: 'bullet3', name: '3 Dakika', seconds: 180, emoji: '🚀' },
    { id: 'blitz5', name: '5 Dakika', seconds: 300, emoji: '⏱️' },
    { id: 'rapid10', name: '10 Dakika', seconds: 600, emoji: '🕐' },
    { id: 'classical30', name: '30 Dakika', seconds: 1800, emoji: '🏛️' }
];

export default function MainMenu({ onStartGame }) {
    const [view, setView] = useState('main'); // main, ai-setup, local-setup
    const [difficulty, setDifficulty] = useState('medium');
    const [timeControl, setTimeControl] = useState('untimed');
    const [playerColor, setPlayerColor] = useState('white');
    const [selectedBoardTheme, setSelectedBoardTheme] = useState('classic');
    const [selectedPieceTheme, setSelectedPieceTheme] = useState('classic');

    const handleStartLocal = () => {
        setView('local-setup');
    };

    const handleStartAI = () => {
        setView('ai-setup');
    };

    const handleSettings = () => {
        setView('settings');
    };

    const handleBack = () => {
        setView('main');
    };

    const handleStartAIGame = () => {
        const selectedTime = TIME_OPTIONS.find(t => t.id === timeControl);
        onStartGame({
            mode: 'ai',
            isAI: true,
            aiColor: playerColor === 'white' ? 'black' : 'white',
            aiDifficulty: difficulty,
            isTimed: selectedTime.seconds > 0,
            timePerPlayer: selectedTime.seconds,
            playerColor: playerColor,
            initialBoardTheme: selectedBoardTheme,
            initialPieceTheme: selectedPieceTheme
        });
    };

    const handleStartLocalGame = () => {
        const selectedTime = TIME_OPTIONS.find(t => t.id === timeControl);
        onStartGame({
            mode: 'local',
            isAI: false,
            isTimed: selectedTime.seconds > 0,
            timePerPlayer: selectedTime.seconds,
            initialBoardTheme: selectedBoardTheme,
            initialPieceTheme: selectedPieceTheme
        });
    };

    const renderMainView = () => (
        <div className="menu-buttons">
            <button className="menu-btn local" onClick={handleStartLocal}>
                <span className="btn-icon">♟️</span>
                <span className="btn-text">Yerel Oyun</span>
                <span className="btn-subtitle">Aynı bilgisayarda 2 oyuncu</span>
            </button>

            <button className="menu-btn ai" onClick={handleStartAI}>
                <span className="btn-icon">🤖</span>
                <span className="btn-text">Bilgisayara Karşı</span>
                <span className="btn-subtitle">Yapay zeka ile oyna</span>
            </button>

            <button className="menu-btn online" disabled>
                <span className="btn-icon">🌐</span>
                <span className="btn-text">Çevrimiçi</span>
                <span className="btn-subtitle">Yakında...</span>
            </button>

            <button className="menu-btn settings" onClick={handleSettings}>
                <span className="btn-icon">⚙️</span>
                <span className="btn-text">Görünüm</span>
                <span className="btn-subtitle">Tema ve renkler</span>
            </button>
        </div>
    );

    const renderAISetup = () => (
        <div className="setup-container">
            <h2 className="setup-title">Bilgisayara Karşı</h2>

            {/* Difficulty Selection */}
            <div className="setup-section">
                <h3 className="section-title">Zorluk Seviyesi</h3>
                <div className="option-grid">
                    {DIFFICULTY_OPTIONS.map(opt => (
                        <button
                            key={opt.id}
                            className={`option-btn ${difficulty === opt.id ? 'selected' : ''}`}
                            onClick={() => setDifficulty(opt.id)}
                        >
                            <span className="option-emoji">{opt.emoji}</span>
                            <span className="option-name">{opt.name}</span>
                            <span className="option-desc">{opt.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Selection */}
            <div className="setup-section">
                <h3 className="section-title">Renk Seçimi</h3>
                <div className="color-selection">
                    <button
                        className={`color-btn white ${playerColor === 'white' ? 'selected' : ''}`}
                        onClick={() => setPlayerColor('white')}
                    >
                        <img src={PIECE_IMAGES.white.king} alt="Beyaz" className="color-piece-img" />
                        <span>Beyaz</span>
                        <span className="color-hint">İlk hamle sende</span>
                    </button>
                    <button
                        className={`color-btn black ${playerColor === 'black' ? 'selected' : ''}`}
                        onClick={() => setPlayerColor('black')}
                    >
                        <img src={PIECE_IMAGES.black.king} alt="Siyah" className="color-piece-img" />
                        <span>Siyah</span>
                        <span className="color-hint">Bilgisayar başlar</span>
                    </button>
                </div>
            </div>

            {/* Time Control */}
            <div className="setup-section">
                <h3 className="section-title">Süre Kontrolü</h3>
                <div className="time-grid">
                    {TIME_OPTIONS.map(opt => (
                        <button
                            key={opt.id}
                            className={`time-btn ${timeControl === opt.id ? 'selected' : ''}`}
                            onClick={() => setTimeControl(opt.id)}
                        >
                            <span className="time-emoji">{opt.emoji}</span>
                            <span className="time-name">{opt.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="setup-actions">
                <button className="action-btn start" onClick={handleStartAIGame}>
                    ▶️ Oyunu Başlat
                </button>
                <button className="action-btn back" onClick={handleBack}>
                    ← Geri
                </button>
            </div>
        </div>
    );

    const renderLocalSetup = () => (
        <div className="setup-container">
            <h2 className="setup-title">Yerel Oyun</h2>

            {/* Time Control */}
            <div className="setup-section">
                <h3 className="section-title">Süre Kontrolü</h3>
                <div className="time-grid">
                    {TIME_OPTIONS.map(opt => (
                        <button
                            key={opt.id}
                            className={`time-btn ${timeControl === opt.id ? 'selected' : ''}`}
                            onClick={() => setTimeControl(opt.id)}
                        >
                            <span className="time-emoji">{opt.emoji}</span>
                            <span className="time-name">{opt.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="setup-actions">
                <button className="action-btn start" onClick={handleStartLocalGame}>
                    ▶️ Oyunu Başlat
                </button>
                <button className="action-btn back" onClick={handleBack}>
                    ← Geri
                </button>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="setup-container">
            <h2 className="setup-title">Görünüm Ayarları</h2>

            {/* Board Theme */}
            <div className="setup-section">
                <h3 className="section-title">Tahta Teması</h3>
                <div className="theme-grid">
                    {BOARD_THEMES.map(theme => (
                        <button
                            key={theme.id}
                            className={`theme-btn ${selectedBoardTheme === theme.id ? 'selected' : ''}`}
                            onClick={() => setSelectedBoardTheme(theme.id)}
                            style={{ '--theme-color': theme.color }}
                        >
                            <img src={theme.img} alt={theme.name} className="theme-preview-img" />
                            <span className="theme-name">{theme.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Piece Theme */}
            <div className="setup-section">
                <h3 className="section-title">Taş Teması</h3>
                <div className="theme-grid">
                    {PIECE_THEMES.map(theme => (
                        <button
                            key={theme.id}
                            className={`theme-btn ${selectedPieceTheme === theme.id ? 'selected' : ''}`}
                            onClick={() => setSelectedPieceTheme(theme.id)}
                        >
                            <div className="piece-preview" style={{ filter: theme.whiteFilter }}>
                                <img src={PIECE_IMAGES.white.king} alt="" />
                            </div>
                            <span className="theme-name">{theme.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="setup-actions">
                <button className="action-btn back" onClick={handleBack}>
                    ← Geri
                </button>
            </div>
        </div>
    );

    return (
        <div className="main-menu">
            <div className="menu-logo">
                <img src={PIECE_IMAGES.white.king} alt="White King" className="logo-piece-img" />
                <img src={PIECE_IMAGES.black.king} alt="Black King" className="logo-piece-img" />
            </div>
            <h1 className="menu-title">Satranç</h1>
            <p className="menu-subtitle">Klasik Strateji Oyunu</p>

            {view === 'main' && renderMainView()}
            {view === 'ai-setup' && renderAISetup()}
            {view === 'local-setup' && renderLocalSetup()}
            {view === 'settings' && renderSettings()}


        </div>
    );
}
