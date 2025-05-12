// 使用 fetch 获取后端数据并填充表格
fetch("http://localhost:5002/getGradesData")
  .then((response) => response.json()) // 解析返回的 JSON 数据
  .then((data) => {
    const tableBody = document.querySelector("#grades-table tbody");
    data.forEach((row) => {
      // 创建新的表格行
      console.log(row);
      const tr = document.createElement("tr");

      // 创建并填充每个单元格
      const tdStudentId = document.createElement("td");
      tdStudentId.textContent = row.student_id;

      const tdStudentName = document.createElement("td");
      tdStudentName.textContent = row.student_name;

      const tdCourse = document.createElement("td");
      tdCourse.textContent = row.course;

      const tdScore = document.createElement("td");
      tdScore.textContent = row.score;

      // 创建操作列（编辑和删除按钮）
      const tdActions = document.createElement("td");
      const editButton = document.createElement("button");
      editButton.textContent = "编辑";
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "删除";
      deleteButton.classList.add("delete");

      // 将按钮加入操作列
      tdActions.appendChild(editButton);
      tdActions.appendChild(deleteButton);

      // 将单元格加入到行中
      tr.appendChild(tdStudentId);
      tr.appendChild(tdCourse);
      tr.appendChild(tdScore);
      tr.appendChild(tdActions);

      // 将行加入到表格的 tbody 中
      tableBody.appendChild(tr);
    });
  })
  .catch((error) => {
    console.error("获取数据失败:", error);
  });

// 处理删除操作
document.querySelector("tbody").addEventListener("click", function (event) {
  if (event.target && event.target.classList.contains("delete")) {
    const row = event.target.closest("tr");
    row.remove(); // 删除行
  }
});

// 处理编辑操作
document.querySelector("tbody").addEventListener("click", function (event) {
  if (event.target && event.target.textContent === "编辑") {
    const row = event.target.closest("tr");
    const cells = row.querySelectorAll("td");

    // 将表格单元格变为可编辑状态
    cells[0].setAttribute("contenteditable", "true");
    cells[1].setAttribute("contenteditable", "true");
    cells[2].setAttribute("contenteditable", "true");

    // 将编辑按钮改为保存按钮
    event.target.textContent = "保存";
    event.target.classList.remove("edit");
    event.target.classList.add("save");
  }

  if (event.target && event.target.textContent === "保存") {
    const row = event.target.closest("tr");
    const cells = row.querySelectorAll("td");

    // 将单元格恢复为不可编辑
    cells[0].removeAttribute("contenteditable");
    cells[1].removeAttribute("contenteditable");
    cells[2].removeAttribute("contenteditable");

    // 将保存按钮改为编辑按钮
    event.target.textContent = "编辑";
    event.target.classList.remove("save");
    event.target.classList.add("edit");

    // 在这里你可以将编辑后的数据发送到后端（如果需要）
    console.log("保存数据:", {
      student_id: cells[0].textContent,
      course: cells[1].textContent,
      score: cells[2].textContent,
    });
  }
});
