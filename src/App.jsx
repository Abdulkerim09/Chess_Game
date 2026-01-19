import { useState, useCallback } from 'react';
import { GameProvider } from './context/GameContext';
import MainMenu from './components/MainMenu';
import Board from './components/Board';
import StatusBar from './components/StatusBar';
import GameOverModal from './components/GameOverModal';
import PromotionModal from './components/PromotionModal';
import { useGame } from './context/GameContext';
import './App.css';

// Game component that uses context
function Game({ onBackToMenu }) {
    const { pendingPromotion, handlePromotion, isAIThinking } = useGame();

    return (
        <>
            <h1 className="title">Satranç</h1>
            <StatusBar onBackToMenu={onBackToMenu} />
            <div className={`board-container ${isAIThinking ? 'ai-thinking' : ''}`}>
                <Board />
            </div>
            <GameOverModal onBackToMenu={onBackToMenu} />
            {pendingPromotion && (
                <PromotionModal
                    color={pendingPromotion.color}
                    onSelect={handlePromotion}
                />
            )}
        </>
    );
}

function App() {
    const [gameMode, setGameMode] = useState('menu'); // menu, playing
    const [gameSettings, setGameSettings] = useState({});

    const handleStartGame = useCallback((settings) => {
        setGameSettings(settings);
        setGameMode('playing');
    }, []);

    const handleBackToMenu = useCallback(() => {
        setGameMode('menu');
        setGameSettings({});
    }, []);

    return (
        <div className="game-container">
            {gameMode === 'menu' && (
                <MainMenu onStartGame={handleStartGame} />
            )}

            {gameMode === 'playing' && (
                <GameProvider gameSettings={gameSettings}>
                    <Game onBackToMenu={handleBackToMenu} />
                </GameProvider>
            )}
        </div>
    );
}

export default App;
