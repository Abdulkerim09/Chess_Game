// Theme configurations for board and pieces

// Board options mapped to imported images
import board1 from '../assets/boards/board-1.png';
import board2 from '../assets/boards/board-2.png'; // Green
import board3 from '../assets/boards/board-3.png'; // Blue/Grey
import board4 from '../assets/boards/board-4.png'; // Brown
import board5 from '../assets/boards/board-5.png'; // Dark

export const BOARD_THEMES = [
    { id: 'classic', name: 'Klasik Ahşap', img: board4, color: '#8b6914' },
    { id: 'emerald', name: 'Zümrüt Yeşili', img: board2, color: '#3a7a58' },
    { id: 'ocean', name: 'Okyanus Mavisi', img: board3, color: '#4a6b8a' },
    { id: 'dark', name: 'Karanlık Mod', img: board5, color: '#4a3c2a' },
    { id: 'light', name: 'Açık Ahşap', img: board1, color: '#d2b48c' },
];

export const PIECE_THEMES = [
    {
        id: 'classic',
        name: 'Klasik',
        whiteFilter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.4)) brightness(1.2) sepia(0.1)',
        blackFilter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.4))'
    },
    {
        id: 'wood',
        name: 'Doğal Ahşap',
        whiteFilter: 'sepia(0.6) saturate(1.6) hue-rotate(10deg) brightness(1.15) contrast(0.9) drop-shadow(0 2px 3px rgba(0, 0, 0, 0.4))',
        blackFilter: 'brightness(1.1) sepia(0.3) hue-rotate(-10deg) drop-shadow(0 2px 3px rgba(0, 0, 0, 0.4))'
    },
    {
        id: 'retro',
        name: 'Retro Gameboy',
        whiteFilter: 'brightness(0.9) sepia(1) hue-rotate(50deg) saturate(3)', // Greenish
        blackFilter: 'brightness(0.4) sepia(1) hue-rotate(50deg) saturate(3)'
    },
    {
        id: 'frost',
        name: 'Buz & Ateş',
        whiteFilter: 'brightness(1.5) hue-rotate(180deg) saturate(0.5)', // Icy blue
        blackFilter: 'brightness(0.8) sepia(1) hue-rotate(-50deg) saturate(2)' // Reddish
    },
    {
        id: 'golden',
        name: 'Altın & Gümüş',
        whiteFilter: 'grayscale(1) brightness(1.7)', // Silver
        blackFilter: 'sepia(1) brightness(0.9) saturate(2)' // Gold
    },
];
