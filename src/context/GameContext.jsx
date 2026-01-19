import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
    createInitialBoard,
    getValidMoves,
    makeMove,
    getGameStatus,
    getCapturedPieces,
    PIECES
} from '../utils/chessLogic';
import { getBestMove, isPromotionMove } from '../utils/chessAI';

const GameContext = createContext(null);

export function GameProvider({ children, gameSettings = {} }) {
    const {
        isAI = false,
        aiColor = 'black',
        aiDifficulty = 'medium',
        isTimed = false,
        timePerPlayer = 600, // 10 minutes in seconds
        playerColor = 'white',
        initialBoardTheme = 'classic',
        initialPieceTheme = 'classic'
    } = gameSettings;

    const initialBoard = createInitialBoard();

    const [board, setBoard] = useState(initialBoard);
    const [currentPlayer, setCurrentPlayer] = useState('white');
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [gameStatus, setGameStatus] = useState('playing');
    const [winner, setWinner] = useState(null);
    const [enPassantTarget, setEnPassantTarget] = useState(null);
    const [moveHistory, setMoveHistory] = useState([]);
    const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });

    // Promotion state
    const [pendingPromotion, setPendingPromotion] = useState(null);

    // AI state
    const [isAIThinking, setIsAIThinking] = useState(false);

    // Theme state
    const [boardTheme, setBoardTheme] = useState(initialBoardTheme);
    const [pieceTheme, setPieceTheme] = useState(initialPieceTheme);

    // Timer state
    const [whiteTime, setWhiteTime] = useState(timePerPlayer);
    const [blackTime, setBlackTime] = useState(timePerPlayer);
    const timerRef = useRef(null);

    // Check if game is still active (not ended)
    const isGameActive = gameStatus === 'playing' || gameStatus === 'check';

    // Timer effect
    useEffect(() => {
        if (!isTimed || !isGameActive || pendingPromotion || isAIThinking) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        timerRef.current = setInterval(() => {
            if (currentPlayer === 'white') {
                setWhiteTime(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setGameStatus('timeout');
                        setWinner('black');
                        return 0;
                    }
                    return prev - 1;
                });
            } else {
                setBlackTime(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setGameStatus('timeout');
                        setWinner('white');
                        return 0;
                    }
                    return prev - 1;
                });
            }
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isTimed, currentPlayer, gameStatus, pendingPromotion, isAIThinking]);

    // AI move effect
    useEffect(() => {
        // AI can move when game is playing or in check (but not checkmate/stalemate/timeout)
        if (!isAI || currentPlayer !== aiColor || !isGameActive || pendingPromotion) {
            return;
        }

        setIsAIThinking(true);

        // Add a small delay to make AI feel more natural
        const thinkingTime = aiDifficulty === 'easy' ? 300 : aiDifficulty === 'hard' ? 800 : 500;

        const timeoutId = setTimeout(() => {
            const aiMove = getBestMove(board, aiColor, enPassantTarget, aiDifficulty);

            if (aiMove) {
                const piece = board[aiMove.fromRow][aiMove.fromCol];

                // Check if it's a promotion move
                if (isPromotionMove(board, aiMove.fromRow, aiMove.fromCol, aiMove.row)) {
                    // AI always promotes to queen
                    executeMove(aiMove.fromRow, aiMove.fromCol, aiMove.row, aiMove.col, aiMove, PIECES.QUEEN);
                } else {
                    executeMove(aiMove.fromRow, aiMove.fromCol, aiMove.row, aiMove.col, aiMove);
                }
            }

            setIsAIThinking(false);
        }, thinkingTime);

        return () => clearTimeout(timeoutId);
    }, [isAI, currentPlayer, aiColor, gameStatus, board, enPassantTarget, aiDifficulty, pendingPromotion]);

    const selectPiece = useCallback((row, col) => {
        if (gameStatus === 'checkmate' || gameStatus === 'stalemate' || gameStatus === 'timeout') return;
        if (pendingPromotion) return;
        if (isAI && currentPlayer === aiColor) return; // Can't move during AI's turn

        const piece = board[row][col];

        // If clicking on own piece, select it
        if (piece && piece.color === currentPlayer) {
            setSelectedPiece({ row, col });
            const moves = getValidMoves(board, row, col, enPassantTarget);
            setValidMoves(moves);
            return true;
        }

        // If a piece is selected and clicking on a valid move, make the move
        if (selectedPiece) {
            const move = validMoves.find(m => m.row === row && m.col === col);
            if (move) {
                movePiece(row, col, move);
                return true;
            }
        }

        // Deselect
        setSelectedPiece(null);
        setValidMoves([]);
        return false;
    }, [board, currentPlayer, selectedPiece, validMoves, gameStatus, enPassantTarget, pendingPromotion, isAI, aiColor]);

    const movePiece = useCallback((toRow, toCol, move = {}) => {
        if (!selectedPiece) return false;

        const { row: fromRow, col: fromCol } = selectedPiece;
        const piece = board[fromRow][fromCol];

        // Check if this is a pawn promotion move
        const isPromotion = piece.type === PIECES.PAWN && (toRow === 0 || toRow === 7);

        if (isPromotion) {
            // Store the pending promotion and wait for user selection
            setPendingPromotion({
                fromRow,
                fromCol,
                toRow,
                toCol,
                move,
                color: piece.color
            });
            return true;
        }

        // Execute the move
        executeMove(fromRow, fromCol, toRow, toCol, move);
        return true;
    }, [board, selectedPiece, currentPlayer]);

    const executeMove = useCallback((fromRow, fromCol, toRow, toCol, move = {}, promotionType = null) => {
        const piece = board[fromRow][fromCol];

        // Make the move
        const newBoard = makeMove(board, fromRow, fromCol, toRow, toCol, move, promotionType);

        // Calculate en passant target for next move
        let newEnPassantTarget = null;
        if (piece.type === PIECES.PAWN && Math.abs(toRow - fromRow) === 2) {
            newEnPassantTarget = {
                row: (fromRow + toRow) / 2,
                col: fromCol
            };
        }

        // Update state
        setBoard(newBoard);
        setEnPassantTarget(newEnPassantTarget);

        // Record move
        const moveRecord = {
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            piece: piece.type,
            color: piece.color,
            captured: board[toRow][toCol],
            promotionType,
            ...move
        };
        setMoveHistory(prev => [...prev, moveRecord]);

        // Update captured pieces
        setCapturedPieces(getCapturedPieces(initialBoard, newBoard));

        // Check game status
        const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
        const status = getGameStatus(newBoard, nextPlayer, newEnPassantTarget);
        setGameStatus(status);

        if (status === 'checkmate') {
            setWinner(currentPlayer);
        } else if (status === 'stalemate') {
            setWinner('draw');
        } else {
            setCurrentPlayer(nextPlayer);
        }

        // Clear selection
        setSelectedPiece(null);
        setValidMoves([]);
    }, [board, currentPlayer, initialBoard]);

    const handlePromotion = useCallback((pieceType) => {
        if (!pendingPromotion) return;

        const { fromRow, fromCol, toRow, toCol, move } = pendingPromotion;

        // Execute the move with the selected promotion piece
        executeMove(fromRow, fromCol, toRow, toCol, move, pieceType);

        // Clear pending promotion
        setPendingPromotion(null);
    }, [pendingPromotion, executeMove]);

    const cancelPromotion = useCallback(() => {
        setPendingPromotion(null);
        setSelectedPiece(null);
        setValidMoves([]);
    }, []);

    const restartGame = useCallback(() => {
        const newBoard = createInitialBoard();
        setBoard(newBoard);
        setCurrentPlayer('white');
        setSelectedPiece(null);
        setValidMoves([]);
        setGameStatus('playing');
        setWinner(null);
        setEnPassantTarget(null);
        setMoveHistory([]);
        setCapturedPieces({ white: [], black: [] });
        setPendingPromotion(null);
        setIsAIThinking(false);
        setWhiteTime(timePerPlayer);
        setBlackTime(timePerPlayer);
    }, [timePerPlayer]);

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const value = {
        board,
        currentPlayer,
        selectedPiece,
        validMoves,
        gameStatus,
        winner,
        capturedPieces,
        moveHistory,
        selectPiece,
        restartGame,
        isGameOver: gameStatus === 'checkmate' || gameStatus === 'stalemate' || gameStatus === 'timeout',
        // Promotion
        pendingPromotion,
        handlePromotion,
        cancelPromotion,
        // AI
        isAI,
        aiColor,
        isAIThinking,
        // Timer
        isTimed,
        whiteTime,
        blackTime,
        formatTime,
        // Player color (for board orientation)
        playerColor,
        // Themes
        boardTheme,
        pieceTheme,
        setBoardTheme,
        setPieceTheme
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
