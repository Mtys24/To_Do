document.addEventListener("DOMContentLoaded", function () {

    const addBtn = document.getElementById("addBtn");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const taskCounter = document.getElementById("taskCounter");
    const toggleBtn = document.getElementById("themeToggle");
    const progressBar = document.getElementById("progressBar");

    const filterAll = document.getElementById("filterAll");
    const filterActive = document.getElementById("filterActive");
    const filterCompleted = document.getElementById("filterCompleted");
    const clearCompleted = document.getElementById("clearCompleted");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentFilter = localStorage.getItem("filter") || "all";
    let draggedIndex = null;

    function loadTheme() {
        const theme = localStorage.getItem("theme") || "dark";

        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            toggleBtn.textContent = "🌙";
        } else {
            document.documentElement.classList.remove("dark");
            toggleBtn.textContent = "☀️";
        }
    }

    toggleBtn.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");

        const isDark = document.documentElement.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        toggleBtn.textContent = isDark ? "🌙" : "☀️";
    });

 
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function saveFilter() {
        localStorage.setItem("filter", currentFilter);
    }

    function updateCounter() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;

        taskCounter.textContent =
            `${pending} pendientes • ${completed} completadas`;

        const percent = total === 0 ? 0 : (completed / total) * 100;
        progressBar.style.width = percent + "%";
    }

    function updateFilterButtons() {
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("text-indigo-500", "font-semibold");
        });

        if (currentFilter === "all")
            filterAll.classList.add("text-indigo-500", "font-semibold");

        if (currentFilter === "active")
            filterActive.classList.add("text-indigo-500", "font-semibold");

        if (currentFilter === "completed")
            filterCompleted.classList.add("text-indigo-500", "font-semibold");
    }

    function renderTasks() {
        taskList.innerHTML = "";

        tasks.forEach((task, index) => {

            if (currentFilter === "active" && task.completed) return;
            if (currentFilter === "completed" && !task.completed) return;

            const li = document.createElement("li");
            li.draggable = true;
            li.className = `
                flex justify-between items-center
                bg-white/10 px-4 py-3 rounded-xl
                hover:bg-white/20
                transition-all duration-200
                cursor-grab active:cursor-grabbing
            `;

  
            const span = document.createElement("span");
            span.textContent = task.text;
            span.className = "flex-1 cursor-pointer";

            if (task.completed) {
                span.classList.add("line-through", "text-gray-400");
            }

            span.addEventListener("click", () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            });

            span.addEventListener("dblclick", () => {

                const input = document.createElement("input");
                input.value = task.text;
                input.className = `
                    flex-1 bg-transparent border-b
                    border-indigo-400 outline-none
                `;

                li.replaceChild(input, span);
                input.focus();

                function saveEdit() {
                    const newText = input.value.trim();
                    if (newText !== "") {
                        tasks[index].text = newText;
                        saveTasks();
                    }
                    renderTasks();
                }

                input.addEventListener("blur", saveEdit);

                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") renderTasks();
                });
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "✕";
            deleteBtn.className =
                "text-red-400 hover:text-red-500 font-bold ml-3";

            deleteBtn.addEventListener("click", () => {
                li.classList.add("opacity-0", "translate-x-5");
                setTimeout(() => {
                    tasks.splice(index, 1);
                    saveTasks();
                    renderTasks();
                }, 200);
            });

            li.addEventListener("dragstart", () => {
                draggedIndex = index;
                li.classList.add("scale-105", "shadow-xl");
            });

            li.addEventListener("dragend", () => {
                li.classList.remove("scale-105", "shadow-xl");
            });

            li.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            li.addEventListener("drop", () => {
                const temp = tasks[draggedIndex];
                tasks[draggedIndex] = tasks[index];
                tasks[index] = temp;

                saveTasks();
                renderTasks();
            });

            li.appendChild(span);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });

        updateCounter();
        updateFilterButtons();
    }

    function createTask(text) {
        tasks.push({ text, completed: false });
        saveTasks();
        renderTasks();
    }

    addBtn.addEventListener("click", () => {
        const text = taskInput.value.trim();
        if (!text) return;
        createTask(text);
        taskInput.value = "";
    });

    taskInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addBtn.click();
    });

    filterAll.addEventListener("click", () => {
        currentFilter = "all";
        saveFilter();
        renderTasks();
    });

    filterActive.addEventListener("click", () => {
        currentFilter = "active";
        saveFilter();
        renderTasks();
    });

    filterCompleted.addEventListener("click", () => {
        currentFilter = "completed";
        saveFilter();
        renderTasks();
    });

    clearCompleted.addEventListener("click", () => {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    });

    // INIT
    loadTheme();
    renderTasks();
});

//test de comando de git

