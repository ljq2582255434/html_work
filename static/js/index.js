fetch("http://localhost:5002/getMultiTableData?tables=students,grades")
  .then((res) => res.json())
  .then((data) => {
    const tableBody = document.querySelector("#grades-table tbody");
    tableBody.innerHTML = "";

    const studentMap = new Map();
    data.students.forEach((s) => {
      studentMap.set(s.student_id, s.student_name);
    });

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
  })
  .catch((err) => {
    console.error("获取数据失败:", err);
  });
