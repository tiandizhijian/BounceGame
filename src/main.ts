import { Game } from './Game';

// 获取Canvas元素
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

if (!canvas) {
  console.error('无法找到游戏Canvas元素');
} else {
  // 创建游戏实例
  const game = new Game(canvas);

  // 初始绘制
  game.start();

  console.log('弹跳游戏已启动！');
  console.log('控制方式：');
  console.log('- 方向键左右/A/D：移动挡板');
  console.log('- 鼠标移动：控制挡板');
  console.log('- 空格键：开始/暂停/继续');
  console.log('- R键：重新开始');
}
