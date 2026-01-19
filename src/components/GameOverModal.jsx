import { useGame } from '../context/GameContext';
import './GameOverModal.css';

export default function GameOverModal({ onBackToMenu }) {
    const { isGameOver, winner, gameStatus, restartGame, isAI, aiColor } = useGame();

    if (!isGameOver) return null;

    const getWinnerText = () => {
        if (gameStatus === 'stalemate') {
            return '🤝 Berabere!';
        }

        if (isAI) {
            if (winner === aiColor) {
                return '😔 Kaybettin!';
            } else {
                return '🎉 Kazandın!';
            }
        }

        return winner === 'white' ? '⚪ Beyaz Kazandı!' : '⚫ Siyah Kazandı!';
    };

    const getSubText = () => {
        if (gameStatus === 'stalemate') {
            return 'Pat durumu - Hareket edecek yer kalmadı';
        }
        if (gameStatus === 'timeout') {
            return 'Süre doldu!';
        }
        return 'Şah Mat!';
    };

    const getEmoji = () => {
        if (gameStatus === 'stalemate') return '🤝';
        if (isAI && winner === aiColor) return '🤖';
        return '👑';
    };

    return (
        <div className="game-over-overlay">
            <div className="game-over-modal">
                <div className="winner-crown">{getEmoji()}</div>
                <h2 className={`winner-text ${winner} ${isAI && winner !== aiColor ? 'winner' : ''}`}>
                    {getWinnerText()}
                </h2>
                <p className="sub-text">{getSubText()}</p>

                <div className="modal-buttons">
                    <button className="btn primary" onClick={restartGame}>
                        ♟️ Tekrar Oyna
                    </button>
                    <button className="btn secondary" onClick={onBackToMenu}>
                        🏠 Ana Menü
                    </button>
                </div>
            </div>
        </div>
    );
}
