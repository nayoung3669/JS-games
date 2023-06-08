var canvas = document.getElementById("gamezone");
var ctx = canvas.getContext("2d"); //캔버스에 그리기 위해 실질적으로 사용되는 도구인 rendering context => 2d
var startButton = document.getElementById("startButton")
var cancelButton = document.getElementById("cancelButton")

var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var rightPressed = false;
var leftPressed = false;

var score = 0;
var today = new Date()
var startText = "Press Start Button Below"
var showGameStart = true
var records = []

if (localStorage.getItem("blockgame_records")) {
    records = JSON.parse(localStorage.getItem("blockgame_records"))
    //같은 id, 같은 score 인 객체를 하나로 합치기
    records = records.reduce(function(acc, current) {
        if (acc.findIndex(({ id }) => id === current.id) === -1) {
            acc.push(current);
        }
        return acc;
    }, []);
    //score가 큰 객체부터 정렬하기
    records.sort(function(a,b) {
        return b.score - a.score
    })
    $("#scoreTable").empty;
    //정렬된 배열을 하나씩 테이블에 append 하기
    records.forEach((record) => {
        let score = record.score
        let date = record.date
        let temp_html = `
            <tr>
                <td>${score}</td>
                <td>${date}</td>
            </tr>
        `
        $("#scoreTable").append(temp_html)
    })
} else {
    records = []
}

function save(score, today) {
    var scores = {
        "id": today,
        "score": score,
        "date" : today.toLocaleDateString(),
    }
    records.push(scores)
    localStorage.setItem('blockgame_records',JSON.stringify(records))
}

function showText() {
    if (showGameStart == true) {
        ctx.fillStyle = 'black'
        ctx.fillRect(120, 100, 240, 60)
        ctx.font = '20px Arial'
        ctx.fillStyle = 'red'
        ctx.fillText(startText, 130, 140)
    } else {
        showGameStart = false
    }
}

//벽돌 만들기
    var bricks = [];
    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

//원 그리기 함수
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0000FF";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#FF00FF";
    ctx.fill();
    ctx.closePath();
}

//벽돌 그리기
function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) { //status = 1 (=공이 치지 않아 벽돌을 그려도 되는 상태)
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#800080";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //직전에 그린 원 지우기
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    //공이 캔버스의 끝(모서리)에 닿았을 때 튕겨내기
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            // clearInterval(draw);
            save(score, today);
            location.reload();
        }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;  //x와 y축을 조금씩 바꾸면서 원이 이동하는 것 처럼 보이게 함
    y += dy;
}

//키의 움직임에 따른 이벤트 핸들러
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//키를 누를 때
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

//키를 놓으면 pressed = false로 돌아감
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    //점수 계산하기 (모든 벽돌이 깨지면 게임 끝)
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        location.reload()
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

//게임 시작 전 세팅
showText();

//게임 시작
function gameInit() {
    showGameStart = false
    setInterval(draw, 10); //10밀리초마다 draw 함수 실행
}

//게임 다시 시작하기
function reload() {
    location.reload()
}

startButton.addEventListener("click", gameInit);
cancelButton.addEventListener("click", reload);


