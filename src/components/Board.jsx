import { useGame } from '../context/GameContext';
import { PIECE_IMAGES, BOARD_SIZE } from '../utils/chessLogic';
import { BOARD_THEMES, PIECE_THEMES } from '../utils/theme';
import './Board.css';

const CELL_SIZE = 64;
const PADDING = 24;

export default function Board() {
    const {
        board,
        selectedPiece,
        validMoves,
        selectPiece,
        gameStatus,
        currentPlayer,
        playerColor,
        isAI,
        boardTheme,
        pieceTheme
    } = useGame();

    // Get active themes
    const activeBoardTheme = BOARD_THEMES.find(t => t.id === boardTheme) || BOARD_THEMES[0];
    const activePieceTheme = PIECE_THEMES.find(t => t.id === pieceTheme) || PIECE_THEMES[0];

    // Determine if board should be flipped (when player is black in AI mode)
    const isFlipped = isAI && playerColor === 'black';

    const handleCellClick = (row, col) => {
        selectPiece(row, col);
    };

    const isSelected = (row, col) => {
        return selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
    };

    const isValidMove = (row, col) => {
        return validMoves.some(m => m.row === row && m.col === col);
    };

    const isCapture = (row, col) => {
        return isValidMove(row, col) && board[row][col] !== null;
    };

    // File and rank labels - reverse if flipped
    const files = isFlipped
        ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
        : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = isFlipped
        ? ['1', '2', '3', '4', '5', '6', '7', '8']
        : ['8', '7', '6', '5', '4', '3', '2', '1'];

    const boardSize = BOARD_SIZE * CELL_SIZE + PADDING * 2;

    // Convert display position to actual board position
    const getActualPosition = (displayRow, displayCol) => {
        if (isFlipped) {
            return {
                row: 7 - displayRow,
                col: 7 - displayCol
            };
        }
        return { row: displayRow, col: displayCol };
    };

    return (
        <div className="board-wrapper">
            <div
                className={`board ${gameStatus === 'check' ? 'in-check' : ''}`}
                style={{
                    width: boardSize,
                    height: boardSize,
                    backgroundImage: `url(${activeBoardTheme.img})`,
                    '--theme-color': activeBoardTheme.color,
                    '--piece-filter-white': activePieceTheme.whiteFilter,
                    '--piece-filter-black': activePieceTheme.blackFilter
                }}
            >
                {/* Rank labels (1-8) */}
                <div className="rank-labels">
                    {ranks.map((rank, i) => (
                        <div
                            key={`rank-${i}`}
                            className="label"
                            style={{ top: PADDING + i * CELL_SIZE + CELL_SIZE / 2 }}
                        >
                            {rank}
                        </div>
                    ))}
                </div>

                {/* File labels (a-h) */}
                <div className="file-labels">
                    {files.map((file, i) => (
                        <div
                            key={`file-${i}`}
                            className="label"
                            style={{ left: PADDING + i * CELL_SIZE + CELL_SIZE / 2 }}
                        >
                            {file}
                        </div>
                    ))}
                </div>

                {/* Board cells */}
                {Array.from({ length: 64 }).map((_, index) => {
                    const displayRow = Math.floor(index / 8);
                    const displayCol = index % 8;

                    // Get actual board position (may be flipped)
                    const { row, col } = getActualPosition(displayRow, displayCol);

                    const piece = board[row][col];
                    const isLight = (row + col) % 2 === 0;
                    const selected = isSelected(row, col);
                    const valid = isValidMove(row, col);
                    const capture = isCapture(row, col);

                    return (
                        <div
                            key={`cell-${displayRow}-${displayCol}`}
                            className={`
                                cell 
                                ${isLight ? 'light' : 'dark'}
                                ${selected ? 'selected' : ''}
                                ${valid ? 'valid-move' : ''}
                                ${capture ? 'capture' : ''}
                                ${piece && piece.color === currentPlayer ? 'can-select' : ''}
                            `}
                            style={{
                                left: PADDING + displayCol * CELL_SIZE,
                                top: PADDING + displayRow * CELL_SIZE,
                                width: CELL_SIZE,
                                height: CELL_SIZE
                            }}
                            onClick={() => handleCellClick(row, col)}
                        >
                            {piece && (
                                <img
                                    src={PIECE_IMAGES[piece.color][piece.type]}
                                    alt={`${piece.color} ${piece.type}`}
                                    className={`piece-img ${piece.color}`}
                                />
                            )}
                            {valid && !capture && (
                                <div className="move-indicator" />
                            )}
                            {capture && (
                                <div className="capture-indicator" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
