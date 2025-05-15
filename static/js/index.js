// 等网页加载完成后执行代码
window.onload = function () {
  const studentName = localStorage.getItem("student_name");
  const isAdmin = localStorage.getItem("is_admin") === "true";
  const welcomeMessage = document.querySelector("#welcomeMessage");
  const logoutBtn = document.querySelector("#logoutBtn");
  const loginLink = document.querySelector("#loginLink");
  const registerLink = document.querySelector("#registerLink");
  const divider = document.querySelector("#divider");
  const loginPrompt = document.querySelector("#loginPrompt");

  if (studentName) {
    // 登录成功后显示欢迎，并隐藏登录注册
    welcomeMessage.textContent = `欢迎您, ${studentName}`;
    logoutBtn.style.display = "inline";
    loginLink.style.display = "none";
    registerLink.style.display = "none";
    divider.style.display = "none";
    loginPrompt.style.display = "none"; // 隐藏“请先登录”
  } else {
    // 显示“请先登录”信息
    welcomeMessage.textContent = "";
    logoutBtn.style.display = "none";
    loginLink.style.display = "inline";
    registerLink.style.display = "inline";
    divider.style.display = "inline";
    loginPrompt.style.display = "block"; // 显示“请先登录”
  }

  const studentId = localStorage.getItem("student_id");

  fetch(
    `http://localhost:5002/getMultiTableData?tables=students,grades&student_id=${studentId}&is_admin=${isAdmin}`
  )
    .then((res) => res.json())
    .then((data) => {
      const tableBody = document.querySelector("#grades-table tbody");
      tableBody.innerHTML = "";

      const studentMap = new Map();
      if (data.students) {
        data.students.forEach((s) => {
          studentMap.set(s.student_id, s.student_name);
        });
      }

      if (data.grades) {
        data.grades.forEach((g) => {
          const tr = document.createElement("tr");

          const tdId = document.createElement("td");
          tdId.textContent = g.student_id;

          const tdName = document.createElement("td");
          tdName.textContent = studentMap.get(g.student_id) || "未知";

          const tdCourse = document.createElement("td");
          tdCourse.textContent = g.course;

          const tdScore = document.createElement("td");
          tdScore.textContent = g.score;

          const tdActions = document.createElement("td");

          if (isAdmin) {
            const editButton = document.createElement("button");
            editButton.textContent = "编辑";
            editButton.onclick = () =>
              openModal(
                g.student_id,
                studentMap.get(g.student_id) || "未知",
                g.course,
                g.score
              );

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "删除";
            deleteButton.classList.add("delete");
            deleteButton.onclick = () => deleteGrade(g.student_id);

            tdActions.appendChild(editButton);
            tdActions.appendChild(deleteButton);
          } else {
            tdActions.display = "none";
            let el = document.getElementById("action");
            el.style.color = "transparent";
            el.style.backgroundColor = "#4a99e2";
          }

          tr.appendChild(tdId);
          tr.appendChild(tdName);
          tr.appendChild(tdCourse);
          tr.appendChild(tdScore);
          tr.appendChild(tdActions);

          tableBody.appendChild(tr);
        });
      }
    })
    .catch((err) => {
      console.error("获取数据失败:", err);
    });
};
function logout() {
  localStorage.removeItem("student_id");
  localStorage.removeItem("student_name");
  localStorage.removeItem("is_admin");
  window.location.href = "/login"; // 跳转到登录页面
}

function openModal(studentId = "", studentName = "", course = "", score = "") {
  const modal = document.querySelector("#modal");
  const modalTitle = document.querySelector("#modalTitle");
  const studentIdInput = document.querySelector("#studentId");
  const studentNameInput = document.querySelector("#studentName");
  const courseInput = document.querySelector("#course");
  const gradeInput = document.querySelector("#grade");

  if (studentId) {
    modalTitle.textContent = "编辑学生";
  } else {
    modalTitle.textContent = "添加学生";
  }

  studentIdInput.value = studentId;
  studentNameInput.value = studentName;
  courseInput.value = course;
  gradeInput.value = score;

  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.querySelector("#modal");
  modal.style.display = "none";
}

document.querySelector("#submitBtn").onclick = function () {
  const studentId = document.querySelector("#studentId").value;
  const studentName = document.querySelector("#studentName").value;
  const course = document.querySelector("#course").value;
  const grade = document.querySelector("#grade").value;

  const isAdmin = localStorage.getItem("is_admin") === "true";

  if (isAdmin) {
    const action = studentId ? "edit" : "add";

    fetch("/saveStudentGrade", {
      method: "POST",
      body: JSON.stringify({
        action,
        studentId,
        studentName,
        course,
        grade,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          window.location.reload();
        } else {
          alert("操作失败");
        }
      })
      .catch((err) => {
        console.error("操作失败:", err);
      });
  } else {
    alert("您没有权限进行此操作");
  }
};

function deleteGrade(studentId) {
  const isAdmin = localStorage.getItem("is_admin") === "true";

  if (isAdmin) {
    fetch("/deleteStudentGrade", {
      method: "POST",
      body: JSON.stringify({ studentId }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          window.location.reload();
        } else {
          alert("删除失败");
        }
      })
      .catch((err) => {
        console.error("删除失败:", err);
      });
  } else {
    alert("您没有权限进行此操作");
  }
}
