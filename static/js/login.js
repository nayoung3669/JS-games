const signInBtn = document.getElementById("signIn");
const signUpBtn = document.getElementById("signUp");
const fistForm = document.getElementById("form1");
const secondForm = document.getElementById("form2");
const container = document.querySelector(".container");

fistForm.addEventListener("submit", (e) => e.preventDefault());
secondForm.addEventListener("submit", (e) => e.preventDefault());

signInBtn.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});

signUpBtn.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

// 회원가입 폼 제출 이벤트 처리
fistForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = fistForm.querySelector('input[name="username"]');
    const id = fistForm.querySelector('input[name="id"]');
    const password = fistForm.querySelector('input[name="password"]');

    formData = new FormData();

    formData.append("username", username.value);
    formData.append("userId", id.value);
    formData.append("password", password.value);

    // 회원가입 데이터 서버로 전송
    fetch("/api/register", {
        method: "POST",
        body: formData,
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.status === "success") {
                alert(res.msg)
                //성공시의 코드 작성
                
            } else {
                alert(res.msg)
                //실패시의 코드 작성
            }
        })
      });

      // 로그인 폼 제출 이벤트 처리
secondForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const logInId = secondForm.querySelector('input[name="id"]');
  const logInPassword = secondForm.querySelector('input[name="password"]');

  formData = new FormData();

  formData.append("userId", logInId.value);
  formData.append("password", logInPassword.value);
  // 로그인 데이터 서버로 전송
  fetch("/api/login", {
    method: "POST",
    body: formData,
})
    .then((res) => res.json())
    .then((res) => {
        if (res.status === "success") {
            window.location.href = "http://127.0.0.1:5500/index.html";
        } else {
            alert(res.msg)
            location.reload()
        }
        

    });

});