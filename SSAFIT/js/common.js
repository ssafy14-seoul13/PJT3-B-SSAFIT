// Custom alert message function
function showAlert(message) {
  const alertBox = document.getElementById("alert-message");
  if (!alertBox) return;
  alertBox.innerText = message;
  alertBox.classList.add("show");
  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 3000);
}

// 로그인 상태에 따라 UI 업데이트
function updateNavbarUI() {
  const authButtonsContainer = document.getElementById("navbar-auth-buttons");
  if (!authButtonsContainer) return;
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (loggedInUser) {
    // 로그인 상태: 로그아웃 버튼과 사용자 이름 표시
    authButtonsContainer.innerHTML = `
      <span class="me-3 d-flex align-items-center fw-bold">${loggedInUser}님</span>
      <button class="btn btn-primary rounded-pill" onclick="logout()">로그아웃</button>
    `;
  } else {
    // 로그아웃 상태: 로그인 및 회원가입 버튼 표시
    authButtonsContainer.innerHTML = `
      <a href="login.html" class="btn btn-primary me-2 rounded-pill">로그인</a>
      <a href="signup.html" class="btn btn-outline-primary rounded-pill">회원가입</a>
    `;
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  showAlert("로그아웃 되었습니다.");
  // 1초 후 메인 페이지로 이동
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

// 모든 페이지가 로드될 때 네비게이션 바 UI를 업데이트
document.addEventListener("DOMContentLoaded", updateNavbarUI);
