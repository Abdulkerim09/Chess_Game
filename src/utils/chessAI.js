// Chess AI using Minimax algorithm with Alpha-Beta pruning
import {
    getValidMoves,
    makeMove,
    getGameStatus,
    isInCheck,
    PIECES
} from './chessLogic';

// Piece values for evaluation
const PIECE_VALUES = {
    [PIECES.PAWN]: 100,
    [PIECES.KNIGHT]: 320,
    [PIECES.BISHOP]: 330,
    [PIECES.ROOK]: 500,
    [PIECES.QUEEN]: 900,
    [PIECES.KING]: 20000
};

// Position bonus tables for each piece type
const PAWN_TABLE = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

const KNIGHT_TABLE = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
];

const BISHOP_TABLE = [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20]
];

const ROOK_TABLE = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0]
];

const QUEEN_TABLE = [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20]
];

const KING_TABLE = [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20]
];

const POSITION_TABLES = {
    [PIECES.PAWN]: PAWN_TABLE,
    [PIECES.KNIGHT]: KNIGHT_TABLE,
    [PIECES.BISHOP]: BISHOP_TABLE,
    [PIECES.ROOK]: ROOK_TABLE,
    [PIECES.QUEEN]: QUEEN_TABLE,
    [PIECES.KING]: KING_TABLE
};

// Evaluate board position
function evaluateBoard(board, currentColor) {
    let score = 0;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (!piece) continue;

            // Material value
            let pieceScore = PIECE_VALUES[piece.type];

            // Position bonus
            const table = POSITION_TABLES[piece.type];
            if (table) {
                // For black pieces, flip the table
                const tableRow = piece.color === 'white' ? row : 7 - row;
                pieceScore += table[tableRow][col];
            }

            // Add or subtract based on piece color
            if (piece.color === currentColor) {
                score += pieceScore;
            } else {
                score -= pieceScore;
            }
        }
    }

    return score;
}

// Minimax with Alpha-Beta pruning
function minimax(board, depth, alpha, beta, maximizingPlayer, aiColor, enPassantTarget) {
    const currentColor = maximizingPlayer ? aiColor : (aiColor === 'white' ? 'black' : 'white');
    const status = getGameStatus(board, currentColor, enPassantTarget);

    // Terminal conditions
    if (status === 'checkmate') {
        return maximizingPlayer ? -100000 + (3 - depth) : 100000 - (3 - depth);
    }
    if (status === 'stalemate') {
        return 0;
    }
    if (depth === 0) {
        return evaluateBoard(board, aiColor);
    }

    // Get all possible moves
    const allMoves = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.color === currentColor) {
                const moves = getValidMoves(board, row, col, enPassantTarget);
                moves.forEach(move => {
                    allMoves.push({ fromRow: row, fromCol: col, ...move });
                });
            }
        }
    }

    // Sort moves for better alpha-beta pruning (captures first)
    allMoves.sort((a, b) => {
        const captureA = board[a.row][a.col] ? 1 : 0;
        const captureB = board[b.row][b.col] ? 1 : 0;
        return captureB - captureA;
    });

    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of allMoves) {
            const newBoard = makeMove(board, move.fromRow, move.fromCol, move.row, move.col, move);
            const evalScore = minimax(newBoard, depth - 1, alpha, beta, false, aiColor, null);
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of allMoves) {
            const newBoard = makeMove(board, move.fromRow, move.fromCol, move.row, move.col, move);
            const evalScore = minimax(newBoard, depth - 1, alpha, beta, true, aiColor, null);
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

// Get best move for AI
export function getBestMove(board, aiColor, enPassantTarget = null, difficulty = 'medium') {
    const depthMap = {
        easy: 1,
        medium: 2,
        hard: 3
    };
    const depth = depthMap[difficulty] || 2;

    // Get all possible moves
    const allMoves = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.color === aiColor) {
                const moves = getValidMoves(board, row, col, enPassantTarget);
                moves.forEach(move => {
                    allMoves.push({ fromRow: row, fromCol: col, ...move });
                });
            }
        }
    }

    if (allMoves.length === 0) return null;

    // For easy mode, occasionally make random moves
    if (difficulty === 'easy' && Math.random() < 0.3) {
        return allMoves[Math.floor(Math.random() * allMoves.length)];
    }

    let bestMove = null;
    let bestScore = -Infinity;

    for (const move of allMoves) {
        const newBoard = makeMove(board, move.fromRow, move.fromCol, move.row, move.col, move);
        const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false, aiColor, null);

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    return bestMove;
}

// Check if it's a pawn promotion move
export function isPromotionMove(board, fromRow, fromCol, toRow) {
    const piece = board[fromRow][fromCol];
    if (!piece || piece.type !== PIECES.PAWN) return false;
    return toRow === 0 || toRow === 7;
}
