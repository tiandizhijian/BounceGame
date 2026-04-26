import { CANVAS_WIDTH, CANVAS_HEIGHT, BRICK_ROWS, BRICK_COLS, GameState } from './types';
import { Ball } from './Ball';
import { Paddle } from './Paddle';
import { Brick } from './Brick';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private ball: Ball;
  private paddle: Paddle;
  private bricks: Brick[][];
  private keys: { [key: string]: boolean };
  private gameState: GameState;
  private score: number;
  private lives: number;
  private maxLives: number;
  private animationId: number | null;
  private bricksCount: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.keys = {};
    this.gameState = GameState.READY;
    this.score = 0;
    this.lives = 3;
    this.maxLives = 3;
    this.animationId = null;
    this.bricksCount = BRICK_ROWS * BRICK_COLS;

    // 初始化游戏对象
    this.ball = new Ball(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 60);
    this.paddle = new Paddle();
    this.bricks = this.createBricks();

    // 绑定事件
    this.bindEvents();
  }

  // 创建砖块阵列
  private createBricks(): Brick[][] {
    const bricks: Brick[][] = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
      bricks[row] = [];
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks[row][col] = new Brick(row, col);
      }
    }
    return bricks;
  }

  // 绑定事件监听
  private bindEvents(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      this.keys[e.key] = true;

      // 空格键暂停/继续/重新开始
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (this.gameState === GameState.PLAYING) {
          this.pause();
        } else if (this.gameState === GameState.PAUSED) {
          this.resume();
        } else if (this.gameState === GameState.READY) {
          this.start();
        } else if (this.gameState === GameState.GAME_OVER || this.gameState === GameState.WIN) {
          this.reset();
          this.start();
        }
      }

      // R键重新开始
      if (e.key === 'r' || e.key === 'R') {
        this.reset();
      }
    });

    document.addEventListener('keyup', (e: KeyboardEvent) => {
      this.keys[e.key] = false;
    });

    // 鼠标移动控制挡板
    this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
      if (this.gameState !== GameState.PLAYING) return;

      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      this.paddle.x = mouseX - this.paddle.width / 2;

      // 边界限制
      if (this.paddle.x < 0) this.paddle.x = 0;
      if (this.paddle.x + this.paddle.width > CANVAS_WIDTH) {
        this.paddle.x = CANVAS_WIDTH - this.paddle.width;
      }
    });
  }

  // 开始游戏
  start(): void {
    if (this.gameState === GameState.PLAYING) return;
    this.gameState = GameState.PLAYING;
    this.gameLoop();
  }

  // 暂停游戏
  pause(): void {
    this.gameState = GameState.PAUSED;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  // 继续游戏
  resume(): void {
    if (this.gameState !== GameState.PAUSED) return;
    this.gameState = GameState.PLAYING;
    this.gameLoop();
  }

  // 重置游戏
  reset(): void {
    this.gameState = GameState.READY;
    this.score = 0;
    this.lives = this.maxLives;
    this.ball.reset(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 60);
    this.paddle = new Paddle();
    this.bricks = this.createBricks();
    this.bricksCount = BRICK_ROWS * BRICK_COLS;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    this.draw();
  }

  // 游戏主循环
  private gameLoop(): void {
    if (this.gameState !== GameState.PLAYING) return;

    this.update();
    this.draw();

    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  // 更新游戏状态
  private update(): void {
    // 更新挡板
    this.paddle.updateKeys(this.keys);
    this.paddle.update();

    // 更新球
    this.ball.update();

    // 球与挡板碰撞
    if (this.paddle.checkCollision(this.ball.x, this.ball.y, this.ball.radius)) {
      // 根据击中挡板的位置改变反弹角度
      const paddleCenter = this.paddle.getCenterX();
      const ballCenter = this.ball.x;
      const relativeIntersectX = paddleCenter - ballCenter;
      const normalizedRelativeIntersectionX = relativeIntersectX / (this.paddle.width / 2);
      const bounceAngle = normalizedRelativeIntersectionX * (Math.PI / 3); // 最大60度角

      const speed = Math.sqrt(this.ball.speedX ** 2 + this.ball.speedY ** 2);
      this.ball.speedX = -speed * Math.sin(bounceAngle);
      this.ball.speedY = -Math.abs(speed * Math.cos(bounceAngle));

      this.ball.y = this.paddle.y - this.ball.radius;
    }

    // 球与砖块碰撞
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        const brick = this.bricks[row][col];
        if (!brick.visible) continue;

        if (brick.checkCollision(this.ball.x, this.ball.y, this.ball.radius)) {
          brick.visible = false;
          this.score += 10;
          this.bricksCount--;

          // 计算反弹方向
          const { speedX, speedY } = brick.getCollisionSide(
            this.ball.x,
            this.ball.y,
            this.ball.speedX,
            this.ball.speedY
          );
          this.ball.speedX = speedX;
          this.ball.speedY = speedY;

          // 检查是否获胜
          if (this.bricksCount === 0) {
            this.gameState = GameState.WIN;
            this.draw();
          }

          break;
        }
      }
    }

    // 球掉出底部
    if (this.ball.isOutOfBounds()) {
      this.lives--;
      if (this.lives <= 0) {
        this.gameState = GameState.GAME_OVER;
        this.draw();
      } else {
        // 重置球的位置
        this.ball.reset(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 60);
      }
    }
  }

  // 绘制游戏
  private draw(): void {
    // 清空画布
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 绘制背景
    this.ctx.fillStyle = '#16213e';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 绘制砖块
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        this.bricks[row][col].draw(this.ctx);
      }
    }

    // 绘制挡板
    this.paddle.draw(this.ctx);

    // 绘制球
    this.ball.draw(this.ctx);

    // 绘制分数和生命值
    this.drawUI();

    // 绘制游戏状态信息
    this.drawGameState();
  }

  // 绘制UI
  private drawUI(): void {
    this.ctx.font = '18px Arial';
    this.ctx.fillStyle = '#fff';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`分数: ${this.score}`, 20, 30);

    this.ctx.textAlign = 'right';
    let livesText = '生命: ';
    for (let i = 0; i < this.maxLives; i++) {
      livesText += i < this.lives ? '❤' : '♡';
    }
    this.ctx.fillText(livesText, CANVAS_WIDTH - 20, 30);
  }

  // 绘制游戏状态
  private drawGameState(): void {
    if (this.gameState === GameState.READY) {
      this.drawOverlay('弹跳游戏', '按空格键开始游戏', '#fff');
    } else if (this.gameState === GameState.PAUSED) {
      this.drawOverlay('游戏暂停', '按空格键继续', '#ff0');
    } else if (this.gameState === GameState.GAME_OVER) {
      this.drawOverlay('游戏结束', `最终分数: ${this.score}\n按空格键重新开始`, '#f00');
    } else if (this.gameState === GameState.WIN) {
      this.drawOverlay('恭喜获胜!', `最终分数: ${this.score}\n按空格键重新开始`, '#0f0');
    }
  }

  // 绘制覆盖层
  private drawOverlay(title: string, message: string, color: string): void {
    // 半透明背景
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 标题
    this.ctx.font = 'bold 48px Arial';
    this.ctx.fillStyle = color;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(title, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);

    // 消息
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = '#fff';
    const lines = message.split('\n');
    lines.forEach((line, index) => {
      this.ctx.fillText(line, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20 + index * 30);
    });

    // 重置 textBaseline
    this.ctx.textBaseline = 'alphabetic';
  }
}
