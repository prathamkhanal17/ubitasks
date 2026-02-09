// State Management
const State = {
  tasks: [],
  taskToDelete: null,
};

// DOM Elements
const DOM = {
  todoList: document.getElementById("todo-list"),
  todoForm: document.getElementById("todo-form"),
  addModal: document.getElementById("add-modal"),
  deleteModal: document.getElementById("delete-modal"),
  taskCountDisplay: document.getElementById("task-count"),
  titleInput: document.getElementById("title-input"),
  descInput: document.getElementById("desc-input"),
  openModalBtn: document.getElementById("open-modal"),
  closeModalBtn: document.getElementById("close-modal"),
  confirmDeleteBtn: document.getElementById("confirm-delete"),
  cancelDeleteBtn: document.getElementById("cancel-delete"),
};

// Persistence Module
const Persistence = {
  saveToHash() {
    const data = JSON.stringify(State.tasks);
    const encoded = btoa(encodeURIComponent(data));
    window.location.hash = encoded;
  },

  loadFromHash() {
    try {
      const hash = window.location.hash.slice(1);
      if (!hash) return false;

      const decoded = decodeURIComponent(atob(hash));
      State.tasks = JSON.parse(decoded);
      return true;
    } catch (e) {
      console.error("Failed to load from hash:", e);
      return false;
    }
  },
};

// UI Module
const UI = {
  updateCount() {
    const count = DOM.todoList.querySelectorAll(".task-item").length;
    DOM.taskCountDisplay.innerText = `${count
      .toString()
      .padStart(2, "0")} ITEMS`;
  },

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  },

  showModal(modal) {
    modal.classList.remove("opacity-0", "pointer-events-none");
  },

  hideModal(modal) {
    modal.classList.add("opacity-0", "pointer-events-none");
  },

  renderTasks() {
    DOM.todoList.innerHTML = "";
    State.tasks.forEach((task, index) => {
      TaskRenderer.render(task, index);
    });
    UI.updateCount();
  },
};

// Task Renderer Module
const TaskRenderer = {
  render(task, index) {
    const li = document.createElement("li");
    li.className = "task-item group transition-all duration-500";
    li.dataset.id = task.id;

    li.innerHTML = this.getTaskHTML(task, index);

    this.attachEventListeners(li, task);
    DOM.todoList.appendChild(li);
  },

  getTaskHTML(task, index) {
    return `
      <div class="flex items-center py-8 px-2 hover:bg-slate-50/50 transition-colors cursor-pointer task-header">
        <div class="drag-handle mr-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab text-slate-300">
          <i class="fa-solid fa-grip-vertical"></i>
        </div>
        <span class="text-slate-300 font-mono text-sm mr-4">${String(
          index + 1,
        ).padStart(2, "0")}</span>
        <span class="editable-title text-xl font-light flex-1" contenteditable="false">${UI.escapeHtml(
          task.title,
        )}</span>
        <button class="edit-task opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-blue-500 transition-all mr-2">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete-task opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>

      <div class="task-content">
        <div class="task-inner px-12 pb-10">
          <p class="editable-desc text-slate-500 font-light mb-8" contenteditable="false">
            ${UI.escapeHtml(task.description) || "No description provided."}
          </p>

          <div class="border-t border-slate-100 pt-6">
            <div class="comments-list space-y-3 mb-6">
              ${task.comments
                .map(
                  (comment) => `
                <div class="text-sm font-light flex gap-3">
                  <span class="text-slate-400 font-medium text-xs mt-0.5">${UI.escapeHtml(
                    comment.username,
                  )}</span>
                  <span>${UI.escapeHtml(comment.text)}</span>
                </div>
              `,
                )
                .join("")}
            </div>

            <div class="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Name"
                maxlength="20"
                class="username-input w-32 px-3 py-2 text-sm border-b border-slate-200 outline-none focus:border-slate-400 transition-colors"
              >
              <input
                type="text"
                placeholder="Add a comment..."
                class="comment-input flex-1 px-3 py-2 text-sm border-b border-slate-200 outline-none focus:border-slate-400 transition-colors"
              >
              <button class="add-comment px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-400 hover:text-black transition-colors">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  attachEventListeners(li, task) {
    const titleEl = li.querySelector(".editable-title");
    const descEl = li.querySelector(".editable-desc");
    const editBtn = li.querySelector(".edit-task");
    const deleteBtn = li.querySelector(".delete-task");
    const taskHeader = li.querySelector(".task-header");

    let isEditing = false;

    editBtn.onclick = (e) => {
      e.stopPropagation();
      isEditing = !isEditing;

      if (isEditing) {
        if (!li.classList.contains("active")) {
          li.classList.add("active");
        }
        titleEl.contentEditable = "true";
        descEl.contentEditable = "true";
        titleEl.focus();
        editBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
      } else {
        titleEl.contentEditable = "false";
        descEl.contentEditable = "false";
        task.title = titleEl.textContent.trim();
        task.description = descEl.textContent.trim();

        Persistence.saveToHash();
        editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
      }
    };

    taskHeader.onclick = (e) => {
      if (isEditing) return;
      li.classList.toggle("active");
    };

    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      State.taskToDelete = { id: task.id, element: li };
      UI.showModal(DOM.deleteModal);
    };

    this.attachCommentListeners(li, task);
  },

  attachCommentListeners(li, task) {
    const usernameInput = li.querySelector(".username-input");
    const commentInput = li.querySelector(".comment-input");
    const commentBtn = li.querySelector(".add-comment");
    const commentsList = li.querySelector(".comments-list");

    // Load cached username from localStorage
    const cachedUsername = localStorage.getItem("cachedUsername");
    if (cachedUsername) {
      usernameInput.value = cachedUsername;
    }

    const postComment = () => {
      const username = usernameInput.value.trim();
      const commentText = commentInput.value.trim();

      if (!username || !commentText) return;

      // Cache the username in localStorage
      localStorage.setItem("cachedUsername", username);

      const comment = {
        username: username,
        text: commentText,
      };

      task.comments.push(comment);

      const c = document.createElement("div");
      c.className =
        "text-sm font-light flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300";
      c.innerHTML = `<span class="text-slate-400 font-medium text-xs mt-0.5">${UI.escapeHtml(
        comment.username,
      )}</span> <span>${UI.escapeHtml(comment.text)}</span>`;
      commentsList.appendChild(c);

      commentInput.value = "";
      Persistence.saveToHash();
    };

    commentBtn.onclick = (e) => {
      e.stopPropagation();
      postComment();
    };

    commentInput.onkeypress = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        postComment();
      }
    };
  },
};

// Task Manager Module
const TaskManager = {
  create(title, description) {
    const task = {
      id: Date.now(),
      title: title,
      description: description,
      comments: [],
    };

    State.tasks.push(task);
    UI.renderTasks();
    Persistence.saveToHash();
    UI.updateCount();
  },

  delete(taskId) {
    State.tasks = State.tasks.filter((t) => t.id !== Number(taskId));
    Persistence.saveToHash();
    UI.renderTasks();
    UI.updateCount();
  },

  reorder() {
    const newOrder = [];
    DOM.todoList.querySelectorAll(".task-item").forEach((li) => {
      const taskId = li.dataset.id;
      const task = State.tasks.find((t) => t.id == taskId);
      if (task) newOrder.push(task);
    });
    State.tasks = newOrder;
    Persistence.saveToHash();
    UI.renderTasks();
  },
};

// Modal Controller Module
const ModalController = {
  init() {
    DOM.openModalBtn.onclick = () => {
      UI.showModal(DOM.addModal);
      DOM.titleInput.focus();
    };

    DOM.closeModalBtn.onclick = () => {
      UI.hideModal(DOM.addModal);
    };

    DOM.cancelDeleteBtn.onclick = () => {
      UI.hideModal(DOM.deleteModal);
      setTimeout(() => {
        State.taskToDelete = null;
      }, 100);
    };

    DOM.confirmDeleteBtn.onclick = () => {
      if (State.taskToDelete) {
        const li = State.taskToDelete.element;
        const taskId = State.taskToDelete.id;
        li.classList.add("opacity-0", "scale-95");
        setTimeout(() => {
          TaskManager.delete(taskId);
          State.taskToDelete = null;
        }, 300);
      }
      UI.hideModal(DOM.deleteModal);
    };

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!DOM.addModal.classList.contains("pointer-events-none")) {
          UI.hideModal(DOM.addModal);
        }
        if (!DOM.deleteModal.classList.contains("pointer-events-none")) {
          UI.hideModal(DOM.deleteModal);
          setTimeout(() => {
            State.taskToDelete = null;
          }, 100);
        }
      }
    });
  },
};

// Form Controller Module
const FormController = {
  init() {
    DOM.todoForm.onsubmit = (e) => {
      e.preventDefault();
      const title = DOM.titleInput.value;
      const desc = DOM.descInput.value;

      TaskManager.create(title, desc);

      DOM.todoForm.reset();
      UI.hideModal(DOM.addModal);
    };
  },
};

// Sortable Controller Module
const SortableController = {
  init() {
    new Sortable(DOM.todoList, {
      animation: 400,
      handle: ".drag-handle",
      ghostClass: "sortable-ghost",
      dragClass: "sortable-drag",
      onEnd: function () {
        TaskManager.reorder();
      },
    });
  },
};

// App Initialization Module
const App = {
  init() {
    const hasData = Persistence.loadFromHash();

    if (hasData) {
      UI.renderTasks();
    } else {
      this.loadDefaultTasks();
    }

    ModalController.init();
    FormController.init();
    SortableController.init();

    window.addEventListener("hashchange", () => {
      if (Persistence.loadFromHash()) {
        UI.renderTasks();
      }
    });
  },

  loadDefaultTasks() {
    State.tasks = [
      {
        id: Date.now(),
        title: "Example task with description",
        description: "This is a sample task to demonstrate the application.",
        comments: [],
      },
      {
        id: Date.now() + 1,
        title: "Click to expand and add comments",
        description:
          "You can add multiple comments from different users to collaborate on tasks.",
        comments: [],
      },
    ];
    UI.renderTasks();
    Persistence.saveToHash();
  },
};

App.init();
