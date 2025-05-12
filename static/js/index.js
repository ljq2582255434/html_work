window.onload = function () {
  const studentName = localStorage.getItem("student_name");
  const isAdmin = localStorage.getItem("is_admin") === "true";
  const welcomeMessage = document.querySelector("#welcomeMessage");
  const logoutBtn = document.querySelector("#logoutBtn");
  const loginLink = document.querySelector("#loginLink");
  const registerLink = document.querySelector("#registerLink");
  const divider = document.querySelector("#divider");

  if (studentName) {
    welcomeMessage.textContent = `欢迎您, ${studentName}`;
    logoutBtn.style.display = "inline";
    loginLink.style.display = "none";
    registerLink.style.display = "none";
    divider.style.display = "none";
  } else {
    welcomeMessage.textContent = "";
    logoutBtn.style.display = "none";
    loginLink.style.display = "inline";
    registerLink.style.display = "inline";
    divider.style.display = "inline";
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
          const editButton = document.createElement("button");
          editButton.textContent = "编辑";
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "删除";
          deleteButton.classList.add("delete");
          tdActions.appendChild(editButton);
          tdActions.appendChild(deleteButton);

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
  window.location.href = "/login";
}
