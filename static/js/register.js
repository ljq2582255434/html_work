document.querySelector("button").addEventListener("click", function (event) {
  event.preventDefault();

  const studentId = document.querySelectorAll('input[type="text"]')[0].value;
  const password = document.querySelectorAll('input[type="password"]')[0].value;
  const confirmPassword = document.querySelectorAll('input[type="password"]')[1]
    .value;
  const checkbox = document.getElementById("checkbox");

  if (!checkbox.checked) {
    alert("请先勾选同意用户协议和隐私政策");
    return;
  }

  if (!studentId || !password || !confirmPassword) {
    alert("请填写完整信息");
    return;
  }

  if (password !== confirmPassword) {
    alert("两次密码不一致");
    return;
  }

  // 发起注册请求
  fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: studentId,
      password: password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("注册成功，正在登录...");
        window.location.href = "/index";
      } else {
        alert("注册失败：" + data.message);
      }
    })
    .catch((err) => {
      console.error("请求错误", err);
      alert("注册出错");
    });
});
