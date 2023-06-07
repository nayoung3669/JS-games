document.addEventListener('DOMContentLoaded', () => {
  const player = document.getElementById('player');
  const obstacleContainer = document.getElementById('obstacle-container');
  const gameOverContainer = document.getElementById('game-over-container');
  const resetButton = document.getElementById('reset-button');
  const gameOverMessage = document.getElementById('game-over-message');

  let playerBottom = 0;
  let playerLeft = 10;
  let isJumping = false;
  let jumpHeight = 150;
  let jumpDuration = 700;
  let fallSpeed = 6;
  let obstacleInterval;
  let score = 0;
  let gameStarted = false;
  let isGameOver = false;

  function control(e) {
    if (isGameOver) {
      if (e.code === 'Space') {
        resetGame();
      }
      return;
    }

    if (e.code === 'Space' && !isJumping) {
      if (!gameStarted) {
        gameStarted = true;
        startGame();
      }
      isJumping = true;
      jump();
    }
  }

  document.addEventListener('keyup', control);

  function jump() {
    let jumpSpeed = (2 * jumpHeight) / jumpDuration;
    let currentPosition = playerBottom;
    let startTime = null;

    function animateJump(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }
      let elapsedTime = timestamp - startTime;
      let jumpDistance = jumpSpeed * elapsedTime;

      if (jumpDistance >= jumpHeight) {
        jumpDistance = jumpHeight;
      }

      playerBottom = currentPosition + jumpDistance;
      player.style.bottom = playerBottom + 'px';

      if (jumpDistance < jumpHeight) {
        requestAnimationFrame(animateJump);
      } else {
        fall();
      }
    }

    requestAnimationFrame(animateJump);
  }

  function fall() {
    function animateFall() {
      if (playerBottom > 0) {
        playerBottom -= fallSpeed;
        player.style.bottom = playerBottom + 'px';
        requestAnimationFrame(animateFall);
      } else {
        playerBottom = 0;
        player.style.bottom = playerBottom + 'px';
        isJumping = false;
      }
    }

    requestAnimationFrame(animateFall);
  }

  function generateObstacle() {
    let obstacleLeft = 600;
    let obstacleBottom = 0;
  
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = obstacleLeft + 'px';
    obstacle.style.bottom = obstacleBottom + 'px';
    obstacleContainer.appendChild(obstacle);
  
    let obstacleMoveInterval = setInterval(() => {
      if (obstacleLeft <= -25) { // 장애물이 화면을 벗어나면 스코어 증가
        clearInterval(obstacleMoveInterval);
        obstacleContainer.removeChild(obstacle);
        score++;
      }
  
      obstacleLeft -= 8; // 장애물의 이동 속도를 더 빠르게 조정
      obstacle.style.left = obstacleLeft + 'px';
  
      if (
        obstacleLeft > playerLeft - 50 &&
        obstacleLeft < playerLeft + 50 &&
        playerBottom < 50
      ) {
        clearInterval(obstacleMoveInterval);
        clearInterval(obstacleInterval);
        if (!isGameOver) {
          isGameOver = true;
          showGameOver();
        }
      }
    }, 20);
  }
  
  

  function startGame() {
    obstacleInterval = setInterval(generateObstacle, 3000);
  }

  function showGameOver() {
    gameStarted = false;
    gameOverContainer.style.display = 'block';
    gameOverMessage.textContent = '게임 오버! 점수: ' + score;
    document.removeEventListener('keyup', control);
  }

  function resetGame() {
    player.style.bottom = 0;
    playerBottom = 0;
    obstacleContainer.innerHTML = '';
    score = 0;
    isGameOver = false;
    gameOverContainer.style.display = 'none';
    document.addEventListener('keyup', control);
  }

  resetButton.addEventListener('click', resetGame);
});
