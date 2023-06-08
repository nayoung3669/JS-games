// 클릭 시 랜덤 이동 기능
// const moveDomElement = document.querySelector('.move-title');
// const randomMoveList = ['clicked1', 'clicked2', 'clicked3', 'clicked4', 'clicked5']
// function randomMoveEvent() {
//   const randomNumber = Math.floor(Math.random() * 5);
//   moveDomElement.classList.add('clicked' + randomNumber);
//   console.log(randomNumber)
//   if (randomNumber === 5) {
//   }
// }

if (history.scrollRestoration) {
  window.history.scrollRestoration = "manual";
}

// 채팅 텍스트 기능

const introTitle = document.getElementsByClassName('intro-title')[0];
const title = " 내가& nbsp;하려고\n 만든 \n개 임. \n";
const start = document.getElementsByClassName('start-button')[0];
const gameLink = document.getElementsByClassName('move-title')[0];

let cnt = 0;
let timer = 0;
function typingIntroTitle() {
  let character = title[cnt++]

  if (character === "\n") {
    introTitle.innerHTML = introTitle.innerHTML + "<br>";
  } else {
    introTitle.innerHTML = introTitle.innerHTML + character;
  }

  if (cnt === title.length) {
    clearInterval(timer);
    introTitle.classList.add('delete');
    start.classList.add('show');
    setTimeout(() => {
      gameLink.classList.add('link');
    }, 3000);
    return;
  }
};

// 셋타임 로딩펑션 -> 3000~4000 / 

// 로딩창


window.onload = function () {
  timer = setInterval(typingIntroTitle, 200);
};

// 클릭 시 스크롤 이동 기능

const introButton = document.querySelector(".move-title");
const gameStart = document.querySelector(".game-bg");

introButton.addEventListener('click', function () {
  window.scrollBy({ top: gameStart.getBoundingClientRect().top, behavior: 'smooth' });
  // document.body.scrollTop = document.body.scrollHeight;
  // gameStart.scrollIntoView({behavior: "smooth"});

});

// const moveTitle = document.querySelector(".move-title");
// if (moveTitle.classList.contains("clicked")) {
//   moveTitle.classList.remove("clicked");
// } else {
//   moveTitle.classList.add("clicked");
// }

// 클릭 시 효과음 넣기
// function playMusic() {
//   const audio = new Audio('./bgm/click.mp3');
//   audio.play();
// }

// move-title 에 효과음 넣기
document.querySelector('.move-title').addEventListener('click', function () {
  const audio = new Audio('./Assets/bgm/click.mp3');
  audio.play();
})
