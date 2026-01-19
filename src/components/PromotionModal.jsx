import { PIECE_IMAGES, PIECES } from '../utils/chessLogic';
import './PromotionModal.css';

const PROMOTION_OPTIONS = [
    { type: PIECES.QUEEN, name: 'Vezir' },
    { type: PIECES.ROOK, name: 'Kale' },
    { type: PIECES.BISHOP, name: 'Fil' },
    { type: PIECES.KNIGHT, name: 'At' }
];

export default function PromotionModal({ color, onSelect }) {
    if (!color) return null;

    return (
        <div className="promotion-overlay">
            <div className="promotion-modal">
                <h3 className="promotion-title">Piyonu Terfi Ettir</h3>
                <p className="promotion-subtitle">Hangi taşa dönüştürmek istiyorsun?</p>

                <div className="promotion-options">
                    {PROMOTION_OPTIONS.map(({ type, name }) => (
                        <button
                            key={type}
                            className={`promotion-option ${color}`}
                            onClick={() => onSelect(type)}
                            title={name}
                        >
                            <img
                                src={PIECE_IMAGES[color][type]}
                                alt={name}
                                className="promotion-piece-img"
                            />
                            <span className="promotion-name">{name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
