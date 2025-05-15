document.querySelector("button").addEventListener("click", function (event) {
  event.preventDefault(); // 阻止表单默认提交行为

  const studentId = document.querySelector('input[type="text"]').value;
  const password = document.querySelector('input[type="password"]').value;
  const checkbox = document.getElementById("checkbox");

  // 检查是否勾选协议
  if (!checkbox.checked) {
    alert("请先勾选同意用户协议和隐私政策");
    return;
  }

  // 发起登录请求
  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      student_id: studentId,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // 保存登录信息到 localStorage
        localStorage.setItem("student_id", studentId);
        localStorage.setItem("student_name", data.student_name);
        localStorage.setItem("is_admin", data.is_admin); // 注意和 index 页面保持一致

        alert("登录成功！");
        window.location.href = "/index";
      } else {
        alert("登录失败：" + data.message);
      }
    })
    .catch((error) => {
      console.error("错误:", error);
      alert("登录请求出错");
    });
});
