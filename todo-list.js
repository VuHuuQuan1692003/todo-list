// ========================================================
// QUẢN LÝ CÔNG VIỆC - TODO LIST (todo-list.js)
// ========================================================

// 1. Mảng dữ liệu quản lý danh sách công việc
let tasks = [
    { id: 1, text: "Quét nhà", completed: false }
];

// 2. Tham chiếu các phần tử DOM cần thao tác
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const completedCountEl = document.getElementById("completedCount");
const totalCountEl = document.getElementById("totalCount");
const footerEl = document.querySelector(".footer");

// Mẫu HTML hiển thị trạng thái chưa có công việc
const emptyStateHTML = `
    <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-text">
            Chưa có công việc nào. Hãy thêm công việc mới!
        </div>
    </div>
`;

// ========================================================
// CÁC HÀM XỬ LÝ (FUNCTIONS)
// ========================================================

/**
 * Chức năng 6: Cập nhật Footer
 * - Tự động đếm và hiển thị số công việc đã hoàn thành / tổng số công việc
 * - Khi tất cả công việc đã hoàn thành (và có ít nhất 1 công việc):
 *   Hiển thị badge "Hoàn thành tất cả" với icon check màu xanh kèm animation
 */
function updateFooter() {
    const totalCount = tasks.length;
    const completedCount = tasks.filter(task => task.completed).length;

    // Cập nhật số đếm
    completedCountEl.textContent = completedCount;
    totalCountEl.textContent = totalCount;

    // Kiểm tra và hiển thị/ẩn badge hoàn thành
    let badgeEl = document.getElementById("completionBadge");

    if (totalCount > 0 && completedCount === totalCount) {
        if (!badgeEl) {
            badgeEl = document.createElement("div");
            badgeEl.id = "completionBadge";
            badgeEl.className = "completion-badge";
            badgeEl.innerHTML = `<span class="check-icon">✓</span> Hoàn thành tất cả`;
            footerEl.appendChild(badgeEl);
        }
    } else {
        if (badgeEl) {
            badgeEl.remove();
        }
    }
}

/**
 * Kiểm tra và hiển thị khối empty-state nếu danh sách công việc rỗng
 */
function checkEmptyState() {
    const emptyStateEl = taskList.querySelector(".empty-state");
    if (tasks.length === 0) {
        if (!emptyStateEl) {
            taskList.innerHTML = emptyStateHTML;
        }
    } else {
        if (emptyStateEl) {
            emptyStateEl.remove();
        }
    }
}

/**
 * Chức năng 2, 3, 4, 5: Tạo một phần tử DOM công việc và gắn các sự kiện
 * Thao tác DOM trực tiếp kết hợp đồng bộ dữ liệu với mảng tasks
 */
function createTaskElement(task) {
    // Container bao ngoài cho từng công việc
    const taskItem = document.createElement("div");
    taskItem.className = `task-item${task.completed ? " completed" : ""}`;
    taskItem.dataset.id = task.id;

    // Checkbox đánh dấu hoàn thành
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;

    // Tên công việc
    const taskText = document.createElement("span");
    taskText.className = `task-text${task.completed ? " completed" : ""}`;
    taskText.textContent = task.text;

    // Khối nút hành động
    const taskActions = document.createElement("div");
    taskActions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "btn-edit";
    editBtn.innerHTML = "✏️ Sửa";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.innerHTML = "🗑️ Xóa";

    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(taskActions);

    // ----------------------------------------------------
    // Chức năng 3: Đánh dấu hoàn thành
    // ----------------------------------------------------
    checkbox.addEventListener("change", function () {
        // Cập nhật trạng thái trong mảng dữ liệu
        task.completed = checkbox.checked;

        // Thao tác DOM trực tiếp: gạch ngang tên và đổi độ mờ item
        if (task.completed) {
            taskItem.classList.add("completed");
            taskText.classList.add("completed");
        } else {
            taskItem.classList.remove("completed");
            taskText.classList.remove("completed");
        }

        // Cập nhật số đếm ở footer
        updateFooter();
    });

    // ----------------------------------------------------
    // Chức năng 4: Sửa công việc
    // ----------------------------------------------------
    editBtn.addEventListener("click", function () {
        // Bật chế độ chỉnh sửa (class editing ẩn task-text theo CSS)
        taskItem.classList.add("editing");

        // Tạo ô input chỉnh sửa với nội dung hiện tại của công việc
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.className = "task-edit-input";
        editInput.value = task.text;

        // Chèn ô input vào trước khối action buttons
        taskItem.insertBefore(editInput, taskActions);

        // Tạo 2 nút: Lưu và Hủy
        const saveBtn = document.createElement("button");
        saveBtn.className = "btn-save";
        saveBtn.innerHTML = "💾 Lưu";

        const cancelBtn = document.createElement("button");
        cancelBtn.className = "btn-cancel";
        cancelBtn.innerHTML = "❌ Hủy";

        // Thay thế nội dung khối taskActions bằng nút Lưu và Hủy
        taskActions.innerHTML = "";
        taskActions.appendChild(saveBtn);
        taskActions.appendChild(cancelBtn);

        // Tự động focus và bôi đen text trong ô input sửa
        editInput.focus();
        editInput.select();

        // Hàm xử lý Lưu nội dung chỉnh sửa
        function handleSave() {
            const newText = editInput.value.trim();

            // Validate: Không cho phép lưu nội dung rỗng
            if (!newText) {
                alert("Tên công việc không được để trống!");
                editInput.focus();
                return;
            }

            // Cập nhật tên công việc trong mảng
            task.text = newText;

            // Cập nhật nội dung hiển thị trên DOM
            taskText.textContent = newText;

            // Kết thúc chế độ chỉnh sửa
            restoreNormalMode();
        }

        // Hàm xử lý Hủy bỏ chỉnh sửa
        function handleCancel() {
            restoreNormalMode();
        }

        // Khôi phục giao diện trở lại bình thường
        function restoreNormalMode() {
            if (editInput.parentElement) {
                editInput.remove();
            }
            taskItem.classList.remove("editing");

            // Khôi phục 2 nút ban đầu: Sửa và Xóa
            taskActions.innerHTML = "";
            taskActions.appendChild(editBtn);
            taskActions.appendChild(deleteBtn);
        }

        // Sự kiện click nút Lưu và Hủy
        saveBtn.addEventListener("click", handleSave);
        cancelBtn.addEventListener("click", handleCancel);

        // Phím tắt: Enter để lưu, Escape để hủy
        editInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
            } else if (e.key === "Escape") {
                e.preventDefault();
                handleCancel();
            }
        });
    });

    // ----------------------------------------------------
    // Chức năng 5: Xóa công việc
    // ----------------------------------------------------
    deleteBtn.addEventListener("click", function () {
        // Hiển thị hộp thoại xác nhận trước khi xóa
        const isConfirmed = confirm("Bạn có chắc chắn muốn xóa công việc này không?");
        if (!isConfirmed) return;

        // Xóa công việc khỏi mảng dữ liệu
        const index = tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
            tasks.splice(index, 1);
        }

        // Xóa phần tử khỏi giao diện DOM
        taskItem.remove();

        // Kiểm tra xem danh sách có bị rỗng không để hiển thị empty-state
        checkEmptyState();

        // Cập nhật số đếm ở footer
        updateFooter();
    });

    return taskItem;
}

// ----------------------------------------------------
// Chức năng 1: Thêm công việc mới
// ----------------------------------------------------
function handleAddTask() {
    const text = taskInput.value.trim();

    // Validate: Không cho phép thêm công việc rỗng (hiển thị thông báo lỗi)
    if (!text) {
        alert("Vui lòng nhập tên công việc!");
        taskInput.focus();
        return;
    }

    // Tạo đối tượng công việc mới
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    // Cập nhật mảng dữ liệu
    tasks.push(newTask);

    // Xóa khối empty-state nếu đang hiển thị
    const emptyStateEl = taskList.querySelector(".empty-state");
    if (emptyStateEl) {
        emptyStateEl.remove();
    }

    // Tạo phần tử DOM và chèn trực tiếp vào giao diện danh sách
    const taskElement = createTaskElement(newTask);
    taskList.appendChild(taskElement);

    // Sau khi thêm thành công:
    // 1. Xóa nội dung trong ô input
    taskInput.value = "";
    // 2. Tự động focus vào ô input để tiếp tục nhập
    taskInput.focus();
    // 3. Cập nhật số đếm ở footer
    updateFooter();
}

// Sự kiện click nút "Thêm"
addBtn.addEventListener("click", handleAddTask);

// Sự kiện nhấn phím Enter trên ô input
taskInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        handleAddTask();
    }
});

// ========================================================
// KHỞI CHẠY ỨNG DỤNG (INITIALIZATION)
// ========================================================
function initApp() {
    // Xóa nội dung tĩnh ban đầu trong HTML
    taskList.innerHTML = "";

    // Render các công việc ban đầu từ mảng tasks (nếu có)
    if (tasks.length === 0) {
        checkEmptyState();
    } else {
        tasks.forEach(task => {
            const element = createTaskElement(task);
            taskList.appendChild(element);
        });
    }

    // Cập nhật footer ban đầu
    updateFooter();
}

// Kích hoạt khi trang đã nạp xong
document.addEventListener("DOMContentLoaded", initApp);

