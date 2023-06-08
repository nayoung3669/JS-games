document.addEventListener('DOMContentLoaded', () => {
  const player = document.getElementById('player');
  const obstacleContainer = document.getElementById('obstacle-container');
  const gameOverContainer = document.getElementById('game-over-container');
  const resetButton = document.getElementById('reset-button');
  const gameOverMessage = document.getElementById('game-over-message');
  const scoreTable = document.getElementById('score-table');

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

  let records = [];

  if (localStorage.getItem('dino_records')) {
    records = JSON.parse(localStorage.getItem('dino_records'));
    records.sort(function(a, b) {
      return b.score - a.score;
    });
  } else {
    records = [];
  }

  displayScoreList(records.slice(0, 5)); // 상위 5개의 점수만 노출되도록 수정

  function displayScoreList(records) {
    scoreTable.innerHTML = ""; // 기존의 내용을 초기화

    records.sort(function(a, b) {
      return b.score - a.score;
    });

    records.slice(0, 5).forEach((record) => {
      let score = record.score;
      let date = record.date;
      let temp_html = `
        <tr>
          <td>${score}</td>
          <td>${date}</td>
        </tr>
      `;
      scoreTable.innerHTML += temp_html;
    });
  }

  function save(score, today) {
    var scoreData = {
      "id": today,
      "score": score,
      "date": today.toLocaleDateString(),
    }
    records.push(scoreData);
    records.sort(function(a, b) {
      return b.score - a.score;
    });
    localStorage.setItem('dino_records', JSON.stringify(records));

    displayScoreList(records); // 스코어를 저장한 후에 스코어 판을 업데이트
  }

  function showGameOver() {
    gameStarted = false;
    gameOverContainer.style.display = 'block';
    gameOverMessage.textContent = 'Game Over! Score: ' + score;

    save(score, new Date());

    document.removeEventListener('keyup', control);
  }

  resetButton.addEventListener('click', resetGame);

  function resetGame() {
    player.style.bottom = 0;
    playerBottom = 0;
    obstacleContainer.innerHTML = '';
    score = 0;
    isGameOver = false;
    gameOverContainer.style.display = 'none';
    document.addEventListener('keyup', control);
  }

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

      obstacleLeft -= 12;
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
    obstacleInterval = setInterval(generateObstacle, 1000);
  }

  function showGameOver() {
    gameStarted = false;
    gameOverContainer.style.display = 'block';
    gameOverMessage.textContent = 'Game Over! Score: ' + score;

    save(score, new Date());

    displayScoreList(records);

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

  // On page load, display the score list from localStorage
  const dino_records = JSON.parse(localStorage.getItem('dino_records')) || [];
  displayScoreList(dino_records);

});
