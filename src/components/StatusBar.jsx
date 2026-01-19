import { useGame } from '../context/GameContext';
import { PIECE_IMAGES } from '../utils/chessLogic';
import './StatusBar.css';

export default function StatusBar({ onBackToMenu }) {
    const {
        currentPlayer,
        gameStatus,
        capturedPieces,
        moveHistory,
        isAI,
        aiColor,
        isAIThinking,
        isTimed,
        whiteTime,
        blackTime,
        formatTime
    } = useGame();

    const getStatusText = () => {
        if (isAIThinking) {
            return '🤔 Bilgisayar düşünüyor...';
        }
        switch (gameStatus) {
            case 'check':
                return '⚠️ ŞAH!';
            case 'checkmate':
                return '👑 ŞAH MAT!';
            case 'stalemate':
                return '🤝 PAT - Berabere';
            case 'timeout':
                return '⏰ Süre Doldu!';
            default:
                if (isAI && currentPlayer === aiColor) {
                    return '🤖 Bilgisayar Oynuyor';
                }
                return currentPlayer === 'white' ? '⚪ Beyaz Oynuyor' : '⚫ Siyah Oynuyor';
        }
    };

    const renderCapturedPieces = (color) => {
        const pieces = capturedPieces[color];

        return (
            <div className={`captured-pieces ${color}`}>
                {pieces.map((type, i) => (
                    <img
                        key={i}
                        src={PIECE_IMAGES[color][type]}
                        alt={type}
                        className="captured-piece-img"
                    />
                ))}
            </div>
        );
    };

    const renderTimer = (color) => {
        if (!isTimed) return null;

        const time = color === 'white' ? whiteTime : blackTime;
        const isLow = time < 60;
        const isCritical = time < 30;

        return (
            <div className={`timer ${isLow ? 'low' : ''} ${isCritical ? 'critical' : ''}`}>
                {formatTime(time)}
            </div>
        );
    };

    const getPlayerLabel = (color) => {
        if (isAI) {
            if (color === aiColor) {
                return '🤖 Bilgisayar';
            }
            return '👤 Sen';
        }
        return color === 'white' ? 'Beyaz' : 'Siyah';
    };

    return (
        <div className="status-bar">
            <div className={`player-info ${currentPlayer === 'white' ? 'active' : ''}`}>
                <div className="player-marker white-marker"></div>
                <span>{getPlayerLabel('white')}</span>
                {renderTimer('white')}
                {renderCapturedPieces('black')}
            </div>

            <div className="center-info">
                <div className={`turn-indicator ${gameStatus} ${isAIThinking ? 'thinking' : ''}`}>
                    {getStatusText()}
                </div>
                <div className="move-count">
                    Hamle: {Math.floor(moveHistory.length / 2) + 1}
                </div>
            </div>

            <div className={`player-info ${currentPlayer === 'black' ? 'active' : ''}`}>
                <div className="player-marker black-marker"></div>
                <span>{getPlayerLabel('black')}</span>
                {renderTimer('black')}
                {renderCapturedPieces('white')}
            </div>

            <button className="leave-btn" onClick={onBackToMenu} title="Ana Menüye Dön">
                ✕
            </button>
        </div>
    );
}
