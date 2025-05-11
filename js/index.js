    <script>
        // 获取后端数据并填充到表格
        fetch('http://localhost:5000/getStudentsData')
            .then(response => response.json())  // 解析返回的 JSON 数据
            .then(data => {
                const tableBody = document.querySelector('#studentTable tbody');
                data.forEach(row => {
                    // 创建新的表格行
                    const tr = document.createElement('tr');

                    // 创建并填充每个单元格
                    const tdStudentId = document.createElement('td');
                    tdStudentId.textContent = row.student_id;

                    const tdStudentName = document.createElement('td');
                    tdStudentName.textContent = row.student_name;

                    const tdCourse = document.createElement('td');
                    tdCourse.textContent = row.course;

                    const tdScore = document.createElement('td');
                    tdScore.textContent = row.score;

                    // 将每个单元格加入到表格行
                    tr.appendChild(tdStudentId);
                    tr.appendChild(tdStudentName);
                    tr.appendChild(tdCourse);
                    tr.appendChild(tdScore);

                    // 将行加入到表格的 tbody 中
                    tableBody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error('获取数据失败:', error);
            });
    </script>