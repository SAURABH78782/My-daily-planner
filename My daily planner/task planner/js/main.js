import { renderTasks, setupEventListeners } from './dom.js';
import { loadTasks } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  renderTasks(loadTasks());
  setupEventListeners();
});
