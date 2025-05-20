import { saveTasks, loadTasks } from './storage.js';
import { debounce, throttle } from './utils.js';

const taskInput = document.getElementById('taskInput');
const searchInput = document.getElementById('searchInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAllBtn');
const backToTopBtn = document.getElementById('backToTopBtn');

let tasks = loadTasks();

export function renderTasks(filtered = tasks) {
  taskList.innerHTML = '';
  filtered.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    
    const span = document.createElement('span');
    span.textContent = `${task.text}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleComplete(index));

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteTask(index);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    saveTasks(tasks);
    renderTasks();
    taskInput.value = '';
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks(tasks);
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  renderTasks();
}

function clearAllTasks() {
  tasks = [];
  saveTasks(tasks);
  renderTasks();
}

function searchTasks(query) {
  const filtered = tasks.filter(task => task.text.toLowerCase().includes(query.toLowerCase()));
  renderTasks(filtered);
}

function toggleBackToTop() {
  backToTopBtn.style.display = window.scrollY > 100 ? 'block' : 'none';
}

export function setupEventListeners() {
  addTaskBtn.addEventListener('click', addTask);
  clearAllBtn.addEventListener('click', clearAllTasks);
  backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  
  window.addEventListener('scroll', throttle(toggleBackToTop, 300));

  searchInput.addEventListener('input', debounce(e => {
    searchTasks(e.target.value);
  }, 300));
}
