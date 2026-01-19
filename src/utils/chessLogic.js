// Chess game logic - Full implementation
import wPawn from '../assets/pieces/w_pawn.png';
import wKnight from '../assets/pieces/w_knight.png';
import wBishop from '../assets/pieces/w_bishop.png';
import wRook from '../assets/pieces/w_rook.png';
import wQueen from '../assets/pieces/w_queen.png';
import wKing from '../assets/pieces/w_king.png';

import bPawn from '../assets/pieces/b_pawn.png';
import bKnight from '../assets/pieces/b_knight.png';
import bBishop from '../assets/pieces/b_bishop.png';
import bRook from '../assets/pieces/b_rook.png';
import bQueen from '../assets/pieces/b_queen.png';
import bKing from '../assets/pieces/b_king.png';

export const BOARD_SIZE = 8;

// Piece types
export const PIECES = {
    KING: 'king',
    QUEEN: 'queen',
    ROOK: 'rook',
    BISHOP: 'bishop',
    KNIGHT: 'knight',
    PAWN: 'pawn'
};

// Piece images
export const PIECE_IMAGES = {
    white: {
        king: wKing,
        queen: wQueen,
        rook: wRook,
        bishop: wBishop,
        knight: wKnight,
        pawn: wPawn
    },
    black: {
        king: bKing,
        queen: bQueen,
        rook: bRook,
        bishop: bBishop,
        knight: bKnight,
        pawn: bPawn
    }
};

// Piece unicode symbols (kept for reference or fallback)
export const PIECE_SYMBOLS = {
    white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
    },
    black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
    }
};

// Initial board setup
export function createInitialBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));

    // Black pieces (top)
    board[0][0] = { type: PIECES.ROOK, color: 'black', hasMoved: false };
    board[0][1] = { type: PIECES.KNIGHT, color: 'black', hasMoved: false };
    board[0][2] = { type: PIECES.BISHOP, color: 'black', hasMoved: false };
    board[0][3] = { type: PIECES.QUEEN, color: 'black', hasMoved: false };
    board[0][4] = { type: PIECES.KING, color: 'black', hasMoved: false };
    board[0][5] = { type: PIECES.BISHOP, color: 'black', hasMoved: false };
    board[0][6] = { type: PIECES.KNIGHT, color: 'black', hasMoved: false };
    board[0][7] = { type: PIECES.ROOK, color: 'black', hasMoved: false };

    // Black pawns
    for (let i = 0; i < 8; i++) {
        board[1][i] = { type: PIECES.PAWN, color: 'black', hasMoved: false };
    }

    // White pawns
    for (let i = 0; i < 8; i++) {
        board[6][i] = { type: PIECES.PAWN, color: 'white', hasMoved: false };
    }

    // White pieces (bottom)
    board[7][0] = { type: PIECES.ROOK, color: 'white', hasMoved: false };
    board[7][1] = { type: PIECES.KNIGHT, color: 'white', hasMoved: false };
    board[7][2] = { type: PIECES.BISHOP, color: 'white', hasMoved: false };
    board[7][3] = { type: PIECES.QUEEN, color: 'white', hasMoved: false };
    board[7][4] = { type: PIECES.KING, color: 'white', hasMoved: false };
    board[7][5] = { type: PIECES.BISHOP, color: 'white', hasMoved: false };
    board[7][6] = { type: PIECES.KNIGHT, color: 'white', hasMoved: false };
    board[7][7] = { type: PIECES.ROOK, color: 'white', hasMoved: false };

    return board;
}

// Check if position is within board
export function isInBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// Get all possible moves for a piece (without considering check)
export function getRawMoves(board, row, col, enPassantTarget = null) {
    const piece = board[row][col];
    if (!piece) return [];

    const moves = [];
    const { type, color, hasMoved } = piece;

    switch (type) {
        case PIECES.PAWN:
            const direction = color === 'white' ? -1 : 1;
            const startRow = color === 'white' ? 6 : 1;

            // Forward move
            if (isInBounds(row + direction, col) && !board[row + direction][col]) {
                moves.push({ row: row + direction, col });

                // Double move from start
                if (row === startRow && !board[row + 2 * direction][col]) {
                    moves.push({ row: row + 2 * direction, col });
                }
            }

            // Captures
            [-1, 1].forEach(dc => {
                const newRow = row + direction;
                const newCol = col + dc;
                if (isInBounds(newRow, newCol)) {
                    const target = board[newRow][newCol];
                    if (target && target.color !== color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    // En passant
                    if (enPassantTarget && enPassantTarget.row === newRow && enPassantTarget.col === newCol) {
                        moves.push({ row: newRow, col: newCol, enPassant: true });
                    }
                }
            });
            break;

        case PIECES.KNIGHT:
            const knightMoves = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1]
            ];
            knightMoves.forEach(([dr, dc]) => {
                const newRow = row + dr;
                const newCol = col + dc;
                if (isInBounds(newRow, newCol)) {
                    const target = board[newRow][newCol];
                    if (!target || target.color !== color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            });
            break;

        case PIECES.BISHOP:
            [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dr, dc]) => {
                for (let i = 1; i < 8; i++) {
                    const newRow = row + dr * i;
                    const newCol = col + dc * i;
                    if (!isInBounds(newRow, newCol)) break;
                    const target = board[newRow][newCol];
                    if (!target) {
                        moves.push({ row: newRow, col: newCol });
                    } else {
                        if (target.color !== color) {
                            moves.push({ row: newRow, col: newCol });
                        }
                        break;
                    }
                }
            });
            break;

        case PIECES.ROOK:
            [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
                for (let i = 1; i < 8; i++) {
                    const newRow = row + dr * i;
                    const newCol = col + dc * i;
                    if (!isInBounds(newRow, newCol)) break;
                    const target = board[newRow][newCol];
                    if (!target) {
                        moves.push({ row: newRow, col: newCol });
                    } else {
                        if (target.color !== color) {
                            moves.push({ row: newRow, col: newCol });
                        }
                        break;
                    }
                }
            });
            break;

        case PIECES.QUEEN:
            // Combination of rook and bishop
            [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dr, dc]) => {
                for (let i = 1; i < 8; i++) {
                    const newRow = row + dr * i;
                    const newCol = col + dc * i;
                    if (!isInBounds(newRow, newCol)) break;
                    const target = board[newRow][newCol];
                    if (!target) {
                        moves.push({ row: newRow, col: newCol });
                    } else {
                        if (target.color !== color) {
                            moves.push({ row: newRow, col: newCol });
                        }
                        break;
                    }
                }
            });
            break;

        case PIECES.KING:
            [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dr, dc]) => {
                const newRow = row + dr;
                const newCol = col + dc;
                if (isInBounds(newRow, newCol)) {
                    const target = board[newRow][newCol];
                    if (!target || target.color !== color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            });

            // Castling
            if (!hasMoved) {
                // Kingside castling
                const kingsideRook = board[row][7];
                if (kingsideRook && kingsideRook.type === PIECES.ROOK && !kingsideRook.hasMoved) {
                    if (!board[row][5] && !board[row][6]) {
                        moves.push({ row, col: 6, castling: 'kingside' });
                    }
                }
                // Queenside castling
                const queensideRook = board[row][0];
                if (queensideRook && queensideRook.type === PIECES.ROOK && !queensideRook.hasMoved) {
                    if (!board[row][1] && !board[row][2] && !board[row][3]) {
                        moves.push({ row, col: 2, castling: 'queenside' });
                    }
                }
            }
            break;
    }

    return moves;
}

// Find king position
export function findKing(board, color) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.type === PIECES.KING && piece.color === color) {
                return { row, col };
            }
        }
    }
    return null;
}

// Check if a position is under attack
export function isSquareAttacked(board, row, col, byColor) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.color === byColor) {
                const moves = getRawMoves(board, r, c);
                if (moves.some(m => m.row === row && m.col === col)) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Check if the current player is in check
export function isInCheck(board, color) {
    const king = findKing(board, color);
    if (!king) return false;
    const opponentColor = color === 'white' ? 'black' : 'white';
    return isSquareAttacked(board, king.row, king.col, opponentColor);
}

// Clone board
export function cloneBoard(board) {
    return board.map(row => row.map(cell => cell ? { ...cell } : null));
}

// Make a move and return new board
export function makeMove(board, fromRow, fromCol, toRow, toCol, move = {}, promotionType = null) {
    const newBoard = cloneBoard(board);
    const piece = { ...newBoard[fromRow][fromCol], hasMoved: true };

    // Handle en passant capture
    if (move.enPassant) {
        const capturedPawnRow = piece.color === 'white' ? toRow + 1 : toRow - 1;
        newBoard[capturedPawnRow][toCol] = null;
    }

    // Handle castling
    if (move.castling) {
        if (move.castling === 'kingside') {
            const rook = { ...newBoard[fromRow][7], hasMoved: true };
            newBoard[fromRow][7] = null;
            newBoard[fromRow][5] = rook;
        } else {
            const rook = { ...newBoard[fromRow][0], hasMoved: true };
            newBoard[fromRow][0] = null;
            newBoard[fromRow][3] = rook;
        }
    }

    // Handle pawn promotion
    if (piece.type === PIECES.PAWN && (toRow === 0 || toRow === 7)) {
        // Use the selected promotion type, or default to queen
        piece.type = promotionType || PIECES.QUEEN;
    }

    newBoard[fromRow][fromCol] = null;
    newBoard[toRow][toCol] = piece;

    return newBoard;
}

// Get valid moves (considering check)
export function getValidMoves(board, row, col, enPassantTarget = null) {
    const piece = board[row][col];
    if (!piece) return [];

    const rawMoves = getRawMoves(board, row, col, enPassantTarget);
    const validMoves = [];

    for (const move of rawMoves) {
        const newBoard = makeMove(board, row, col, move.row, move.col, move);

        // Check if move puts own king in check
        if (!isInCheck(newBoard, piece.color)) {
            // For castling, also check that king doesn't pass through attacked square
            if (move.castling) {
                const opponentColor = piece.color === 'white' ? 'black' : 'white';
                const passingCol = move.castling === 'kingside' ? 5 : 3;

                // Check if current position is in check
                if (isInCheck(board, piece.color)) continue;

                // Check if passing square is attacked
                if (isSquareAttacked(board, row, passingCol, opponentColor)) continue;
            }
            validMoves.push(move);
        }
    }

    return validMoves;
}

// Check for checkmate or stalemate
export function getGameStatus(board, currentColor, enPassantTarget = null) {
    let hasValidMove = false;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.color === currentColor) {
                const moves = getValidMoves(board, row, col, enPassantTarget);
                if (moves.length > 0) {
                    hasValidMove = true;
                    break;
                }
            }
        }
        if (hasValidMove) break;
    }

    if (!hasValidMove) {
        if (isInCheck(board, currentColor)) {
            return 'checkmate';
        }
        return 'stalemate';
    }

    if (isInCheck(board, currentColor)) {
        return 'check';
    }

    return 'playing';
}

// Get all pieces for a color
export function getCapturedPieces(initialBoard, currentBoard) {
    const initial = { white: {}, black: {} };
    const current = { white: {}, black: {} };

    // Count initial pieces
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = initialBoard[row][col];
            if (piece) {
                initial[piece.color][piece.type] = (initial[piece.color][piece.type] || 0) + 1;
            }
        }
    }

    // Count current pieces
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = currentBoard[row][col];
            if (piece) {
                current[piece.color][piece.type] = (current[piece.color][piece.type] || 0) + 1;
            }
        }
    }

    // Calculate captured
    const captured = { white: [], black: [] };
    ['white', 'black'].forEach(color => {
        Object.keys(initial[color]).forEach(type => {
            const diff = (initial[color][type] || 0) - (current[color][type] || 0);
            for (let i = 0; i < diff; i++) {
                captured[color].push(type);
            }
        });
    });

    return captured;
}
