import { CANVAS_WIDTH, CANVAS_HEIGHT, BALL_RADIUS, BALL_SPEED, BALL_COLOR } from './types';

export class Ball {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.radius = BALL_RADIUS;
    this.color = BALL_COLOR;
    // 初始化随机方向
    const angle = (Math.random() * Math.PI / 3) - Math.PI / 6; // -30 到 30 度
    this.speedX = BALL_SPEED * Math.sin(angle);
    this.speedY = -BALL_SPEED * Math.cos(angle);
  }

  // 更新球的位置
  update(): void {
    this.x += this.speedX;
    this.y += this.speedY;

    // 左右墙壁碰撞
    if (this.x - this.radius <= 0) {
      this.x = this.radius;
      this.speedX = Math.abs(this.speedX);
    } else if (this.x + this.radius >= CANVAS_WIDTH) {
      this.x = CANVAS_WIDTH - this.radius;
      this.speedX = -Math.abs(this.speedX);
    }

    // 上墙壁碰撞
    if (this.y - this.radius <= 0) {
      this.y = this.radius;
      this.speedY = Math.abs(this.speedY);
    }
  }

  // 绘制球
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    // 添加高光效果
    ctx.beginPath();
    ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
    ctx.closePath();
  }

  // 重置球的位置和速度
  reset(x: number, y: number): void {
    this.x = x;
    this.y = y;
    const angle = (Math.random() * Math.PI / 3) - Math.PI / 6;
    this.speedX = BALL_SPEED * Math.sin(angle);
    this.speedY = -BALL_SPEED * Math.cos(angle);
  }

  // 检查是否掉出屏幕底部
  isOutOfBounds(): boolean {
    return this.y - this.radius > CANVAS_HEIGHT;
  }
}
