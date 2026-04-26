import { BRICK_WIDTH, BRICK_HEIGHT, BRICK_PADDING, BRICK_OFFSET_TOP, BRICK_OFFSET_LEFT, BRICK_COLORS } from './types';

export class Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  visible: boolean;
  row: number;

  constructor(row: number, col: number) {
    this.width = BRICK_WIDTH;
    this.height = BRICK_HEIGHT;
    this.x = BRICK_OFFSET_LEFT + col * (BRICK_WIDTH + BRICK_PADDING);
    this.y = BRICK_OFFSET_TOP + row * (BRICK_HEIGHT + BRICK_PADDING);
    this.row = row;
    this.color = BRICK_COLORS[row % BRICK_COLORS.length];
    this.visible = true;
  }

  // 绘制砖块
  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return;

    // 主砖块
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 4);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    // 高光效果
    ctx.beginPath();
    ctx.roundRect(this.x + 2, this.y + 2, this.width - 4, this.height / 2 - 2, 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fill();
    ctx.closePath();
  }

  // 检查碰撞
  checkCollision(ballX: number, ballY: number, ballRadius: number): boolean {
    if (!this.visible) return false;

    return (
      ballX + ballRadius > this.x &&
      ballX - ballRadius < this.x + this.width &&
      ballY + ballRadius > this.y &&
      ballY - ballRadius < this.y + this.height
    );
  }

  // 获取碰撞后的反弹方向
  getCollisionSide(ballX: number, ballY: number, speedX: number, speedY: number): { speedX: number; speedY: number } {
    const ballCenterX = ballX;
    const ballCenterY = ballY;
    const brickCenterX = this.x + this.width / 2;
    const brickCenterY = this.y + this.height / 2;

    const dx = ballCenterX - brickCenterX;
    const dy = ballCenterY - brickCenterY;

    // 判断从哪边碰撞
    if (Math.abs(dx / (this.width / 2)) > Math.abs(dy / (this.height / 2))) {
      // 左右碰撞
      return { speedX: -speedX, speedY: speedY };
    } else {
      // 上下碰撞
      return { speedX: speedX, speedY: -speedY };
    }
  }
}
