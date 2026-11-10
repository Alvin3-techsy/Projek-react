
import { useEffect, useState } from "react";

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="list-group-item d-flex align-items-center gap-3 py-3">
      <input
        type="checkbox"
        className="form-check-input mt-0"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Tandai ${task.title} sebagai selesai`}
      />

      <span
        className={`flex-grow-1 ${
          task.completed ? "text-decoration-line-through text-secondary" : ""
        }`}
      >
        {task.title}
      </span>

      <button
        type="button"
        className="btn btn-outline-danger btn-sm"
        onClick={() => onDelete(task.id)}
      >
        Hapus
      </button>
    </li>
  );
}

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("todoTasks");

    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [taskInput, setTaskInput] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(event) {
    event.preventDefault();

    const taskTitle = taskInput.trim();

    if (taskTitle === "") {
      setErrorMessage("Silakan isi terlebih dahulu.");
      return;
    }
    // buat hapus saat input valid
    setErrorMessage("");

    const newTask = {
      id: Date.now(),
      title: taskTitle,
      completed: false
    };

    setTasks(previousTasks => [...previousTasks, newTask]);
    setTaskInput("");
  }

  function toggleTask(taskId) {
    setTasks(previousTasks =>
      previousTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(taskId) {
    setTasks(previousTasks =>
      previousTasks.filter(task => task.id !== taskId)
    );
  }

  function clearAllTasks() {
    if (tasks.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus semua tugas?"
    );

    if (confirmed) {
      setTasks([]);
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "active") {
      return !task.completed;
    }

    if (currentFilter === "completed") {
      return task.completed;
    }

    return true;
  });

  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <main className="container py-5">
      <div className="todo-card mx-auto bg-white shadow rounded-4 p-4 p-md-5">
        <header className="mb-4">
          <p className="text-primary fw-semibold mb-2">
            DAILY PRODUCTIVITY
          </p>

          <h1 className="fw-bold mb-2">To-Do List</h1>

          <p className="text-secondary mb-0">
            Membantu prodaktifitasmu hari ini.
          </p>
        </header>

        <form onSubmit={addTask} className="mb-4">
          <label htmlFor="taskInput" className="form-label fw-semibold">
            Tambahkan tugas baru
          </label>

          <div className="input-group">
            <input
              id="taskInput"
              type="text"
              className={`form-control ${errorMessage ? "is-invalid" : ""}`}
              placeholder="Contoh: Latihan di jam 10"
              value={taskInput}
              onChange={event => {setTaskInput(event.target.value);
                setErrorMessage("");
              }}
            />

            <button type="submit" className="btn btn-primary px-4">
              Tambah
            </button>
          </div>
            {errorMessage && (
              <div className="alert alert-danger py-2 mt-2 mb-0" role="alert">
                {errorMessage}
              </div>
            )}
        </form>
          
        <div className="row g-3 mb-4">
          <div className="col-4">
            <div className="summary-box rounded-3 p-3 text-center">
              <div className="text-secondary small">Semua</div>
              <div className="fs-4 fw-bold">{tasks.length}</div>
            </div>
          </div>

          <div className="col-4">
            <div className="summary-box rounded-3 p-3 text-center">
              <div className="text-secondary small">Aktif</div>
              <div className="fs-4 fw-bold text-primary">{activeCount}</div>
            </div>
          </div>

          <div className="col-4">
            <div className="summary-box rounded-3 p-3 text-center">
              <div className="text-secondary small">Selesai</div>
              <div className="fs-4 fw-bold text-success">
                {completedCount}
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <h2 className="h5 fw-bold mb-0">Daftar Tugas</h2>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={clearAllTasks}
            disabled={tasks.length === 0}
          >
            Hapus Semua
          </button>
        </div>

        <div className="d-flex gap-2 mb-3" role="group" aria-label="Filter tugas">
          <button
            type="button"
            className={`btn btn-sm ${
              currentFilter === "all" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setCurrentFilter("all")}
          >
            Semua
          </button>

          <button
            type="button"
            className={`btn btn-sm ${
              currentFilter === "active" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setCurrentFilter("active")}
          >
            Aktif
          </button>

          <button
            type="button"
            className={`btn btn-sm ${
              currentFilter === "completed"
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => setCurrentFilter("completed")}
          >
            Selesai
          </button>
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state text-center text-secondary py-5">
              {tasks.length === 0
                ? "Belum ada tugas."
                : "Tidak ada tugas dalam kategori ini."}
            </div>
          ) : (
            <ul className="list-group list-group-flush">
              {filteredTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))}
            </ul>
          )}
        </div>

        <footer className="text-secondary small mt-3">
          {activeCount === 0
            ? "Semua tugas sudah selesai!"
            : `Masih ada ${activeCount} tugas yang perlu diselesaikan.`}
        </footer>
      </div>
    </main>
  );
}

export default App;
