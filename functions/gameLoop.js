
let running = true;
let lastFrameTime = 0;
let timer = 0;

export function gameLoop(currentTime) {
    const dT = (currentTime - lastFrameTime) / 1000;
    lastFrameTime = currentTime;
  
    UpdateTime(dT);
  
    if(running) {
      requestAnimationFrame(gameLoop)
    }
  }
  
  function UpdateTime(dT) {
    timer += dT;
  }