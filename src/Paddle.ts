import { CANVAS_WIDTH, CANVAS_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED, PADDLE_COLOR, KeyState } from './types';

export class Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  private keys: KeyState;

  constructor() {
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.x = (CANVAS_WIDTH - this.width) / 2;
    this.y = CANVAS_HEIGHT - 40;
    this.color = PADDLE_COLOR;
    this.keys = {};
  }

  // 更新按键状态
  updateKeys(keys: KeyState): void {
    this.keys = keys;
  }

  // 更新挡板位置
  update(): void {
    if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
      this.x -= PADDLE_SPEED;
    }
    if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
      this.x += PADDLE_SPEED;
    }

    // 边界限制
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > CANVAS_WIDTH) {
      this.x = CANVAS_WIDTH - this.width;
    }
  }

  // 绘制挡板
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 8);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    // 添加渐变效果
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 8);
    ctx.fill();
    ctx.closePath();
  }

  // 获取挡板中心X坐标
  getCenterX(): number {
    return this.x + this.width / 2;
  }

  // 检查球是否击中挡板
  checkCollision(ballX: number, ballY: number, ballRadius: number): boolean {
    return (
      ballX + ballRadius > this.x &&
      ballX - ballRadius < this.x + this.width &&
      ballY + ballRadius > this.y &&
      ballY - ballRadius < this.y + this.height
    );
  }
}
