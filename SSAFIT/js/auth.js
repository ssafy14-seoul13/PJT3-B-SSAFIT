document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    // 로그인 폼 제출 이벤트
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find((u) => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem("loggedInUser", user.username);
                showAlert(`${user.username}님, 환영합니다!`);
                // 로그인 성공 후 1초 뒤 메인 페이지로 이동
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000);
            } else {
                showAlert("로그인 정보가 다릅니다.");
            }
        });
    }

    // 회원가입 폼 제출 이벤트
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("signup-username").value;
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;
            const passwordConfirm = document.getElementById("signup-password-confirm").value;

            if (password !== passwordConfirm) {
                showAlert("비밀번호가 다릅니다.");
                return;
            }

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const userExists = users.some((user) => user.email === email);
            if (userExists) {
                showAlert("이미 존재하는 이메일입니다.");
                return;
            }

            const newUser = { username, email, password };
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));
            showAlert("회원가입이 성공적으로 완료되었습니다.");
            // 회원가입 성공 후 1초 뒤 로그인 페이지로 이동
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        });
    }
});
