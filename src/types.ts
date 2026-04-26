// 游戏常量配置
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

// 挡板配置
export const PADDLE_WIDTH = 100;
export const PADDLE_HEIGHT = 15;
export const PADDLE_SPEED = 8;
export const PADDLE_COLOR = '#0f3460';

// 球配置
export const BALL_RADIUS = 10;
export const BALL_SPEED = 5;
export const BALL_COLOR = '#e94560';

// 砖块配置
export const BRICK_ROWS = 5;
export const BRICK_COLS = 8;
export const BRICK_WIDTH = 80;
export const BRICK_HEIGHT = 25;
export const BRICK_PADDING = 10;
export const BRICK_OFFSET_TOP = 60;
export const BRICK_OFFSET_LEFT = 40;

// 颜色数组 - 不同行不同颜色
export const BRICK_COLORS = ['#e94560', '#f38181', '#fce38a', '#95e1d3', '#3d5a80'];

// 游戏状态
export enum GameState {
  READY = 'ready',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'game_over',
  WIN = 'win'
}

// 键盘状态
export interface KeyState {
  [key: string]: boolean;
}
