document.addEventListener('DOMContentLoaded', () => {
  const player = document.getElementById('player');
  const obstacleContainer = document.getElementById('obstacle-container');
  const gameOverContainer = document.getElementById('game-over-container');
  const resetButton = document.getElementById('reset-button');
  const gameOverMessage = document.getElementById('game-over-message');
  const scoreListContainer = document.getElementById('score-list-container');

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
      if (obstacleLeft <= -25) {
        clearInterval(obstacleMoveInterval);
        obstacleContainer.removeChild(obstacle);
        score++;
      }

      obstacleLeft -= 8;
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
    gameOverMessage.textContent = 'Game Over! Score: ' + score;

    // localStorage에서 기존 스코어 리스트 가져오기
    let scores = JSON.parse(localStorage.getItem('scores')) || [];

    // 현재 스코어를 리스트에 추가하기
    scores.push(score);

    // 스코어를 내림차순으로 정렬하기
    scores.sort((a, b) => b - a);

    // 스코어를 10개로 제한하기
    scores = scores.slice(0, 10);

    // 업데이트된 스코어를 localStorage에 저장하기
    localStorage.setItem('scores', JSON.stringify(scores));

    // 스코어 리스트를 화면에 표시하기
    displayScoreList(scores);

    document.removeEventListener('keyup', control);
  }

  function displayScoreList(scores) {
    scoreListContainer.innerHTML = '';

    scores.forEach((score, index) => {
      const scoreItem = document.createElement('li');
      scoreItem.textContent = `${index + 1}. ${score}`;
      scoreListContainer.appendChild(scoreItem);
    });
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

  // On page load, display the score list from localStorage
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  // 스코어 랭킹을 초기화하기 위해 localStorage에서 'scores' 키 제거
  localStorage.removeItem('scores');

  // 화면에서 스코어 리스트를 초기화하여 표시 제거
  displayScoreList([]);
});
