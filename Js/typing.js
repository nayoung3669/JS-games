const GAME_TIME = 6;
let score = 0;
let time = GAME_TIME;
let isPlaying = false;
let timeInterval;
let checkInterval;
let words = [];
let nameAddArray = [];

const wordInput = document.querySelector('.word-input');
const wordDisplay = document.querySelector('.word-display');
const scoreDisplay = document.querySelector('.score');
const timeDisplay = document.querySelector('.time');
const button = document.querySelector('.button');
const userName = document.querySelector('#userName');

init();

function init() {
    buttonChange('loading....');
    getWords();
    wordInput.addEventListener('input', checkMatch)

}

// 게임 실행
function run() {
    if (isPlaying) {
        return
    }
    isPlaying = true;
    time = GAME_TIME;
    score = 0;
    wordInput.focus();
    
    scoreDisplay.innerText = 0;
    timeInterval = setInterval(countDown, 1000);
    checkInterval = setInterval(checkStatus, 50);
    buttonChange('in game...')
    const inputWordBox = document.getElementById("inputWordBox")
    inputWordBox.setAttribute("style", "display:inline-block")
}

function checkStatus() {
    if (!isPlaying && time === 0) {
        
        buttonChange("Game start!")

        clearInterval(checkInterval)
        saveLoad()
    }
}

// 단어불러오기
function getWords() {
    axios.get('https://random-word-api.herokuapp.com/word?number=100')
        .then(function (response) {
            response.data.forEach((word) => {
                if (word.length < 10) {
                    words.push(word);
                }
            })
            buttonChange('Game start!')
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

// 단어일치 체크
function checkMatch() {
    if (wordInput.value.toLowerCase() == wordDisplay.innerText.toLowerCase()) {
        wordInput.value = "";
        if (!isPlaying) {
            return;
        }
        score++;
        scoreDisplay.innerText = score;
        time = GAME_TIME;
        const randomIndex = Math.floor(Math.random() * words.length);
        wordDisplay.innerText = words[randomIndex];
    }
}


function countDown() {
    // 삼항연산자 : (조건) ? 참일 경우 : 거짓일 경우
    time > 0 ? time-- : isPlaying = false;
    if (!isPlaying) {
        clearInterval(timeInterval)
    }
    timeDisplay.innerText = time;
}

function buttonChange(text) {
    button.innerText = text;
    text === 'Game start!' ? button.classList.remove('loading') : button.classList.add('loading')
}

function saveLoad() {
    const score = document.getElementById("saveButton")
    const loadScore = document.getElementById("loadButton")
    score.setAttribute("style", "display: inline-block;")
    loadScore.setAttribute("style", "display:inline-block;")
    userName.setAttribute("style", "display:inline-block;")
}

function save() {
    const score = document.getElementById("score")
    ranking(score.innerText, userName.value)
}

function load() {
    const loadDiv = document.getElementById("load")
    nameAddArray.forEach(e => {
        const load = document.createElement("div")
        load.setAttribute("class", "div-ranking")
        const loadName = document.createElement("p")
        const loadCount = document.createElement("p")
        loadName.innerText = `닉네임: ${e['name']}`
        loadCount.innerText = `점수: ${e['count']}`
        load.appendChild(loadName)
        load.appendChild(loadCount)
        loadDiv.appendChild(load)
    })
    nameAddArray = []
}

function ranking(score, name) {
    var nameAdd = {
        name: name,
        count: score
    };
    nameAddArray.push(nameAdd)
    const score2 = document.getElementById("saveButton")
    score2.setAttribute("style", "display:none;")
    userName.setAttribute("style", "display:none;")
}