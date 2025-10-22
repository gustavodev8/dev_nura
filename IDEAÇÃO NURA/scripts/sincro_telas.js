/* ========================================
   EXIBIÇÃO DE TAREFAS NA PÁGINA INICIAL
   Arquivo: home_tasks.js
   Sincroniza com o gerenciador de tarefas
   ======================================== */

const STORAGE_KEY = 'nura_tasks';
let homeTasks = [];

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
  loadAndDisplayTasks();
  setupStorageListener();
});

// ===== CARREGAR E EXIBIR TAREFAS =====
function loadAndDisplayTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      homeTasks = JSON.parse(savedTasks);
      renderAllTasks();
    } else {
      showEmptyState();
    }
  } catch (error) {
    console.error('❌ Erro ao carregar tarefas:', error);
    showEmptyState();
  }
}

// ===== RENDERIZAR TODAS AS TAREFAS =====
function renderAllTasks() {
  const container = document.getElementById('tasksContainer');
  if (!container) return;

  container.innerHTML = '';

  if (homeTasks.length === 0) {
    showEmptyState();
    return;
  }

  const sortedTasks = [...homeTasks].sort((a, b) => {
    if (a.status === 'concluido' && b.status !== 'concluido') return 1;
    if (a.status !== 'concluido' && b.status === 'concluido') return -1;
    return 0;
  });

  sortedTasks.forEach(task => {
    const taskElement = createTaskElement(task);
    container.appendChild(taskElement);
  });

  updateTaskCounter();
}

// ===== CRIAR ELEMENTO DE TAREFA =====
function createTaskElement(task) {
  const taskDiv = document.createElement('div');
  taskDiv.className = `task-item ${task.status === 'concluido' ? 'completed' : ''}`;
  taskDiv.setAttribute('data-task-id', task.id);

  const borderColor = {
    'progresso': '#3B8C6E',
    'pendente': '#ffc107',
    'concluido': '#198754'
  }[task.status] || '#ccc';

  const priorityColor = {
    'high': '#dc3545',
    'medium': '#ffc107',
    'low': '#6c757d'
  }[task.priority] || '#999';

  const priorityText = {
    'high': 'Alta',
    'medium': 'Média',
    'low': 'Baixa'
  }[task.priority] || 'N/A';

  const dateObj = new Date(task.dueDate + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = dateObj < today && task.status !== 'concluido';

  taskDiv.innerHTML = `
    <div class="task-border" style="background-color: ${borderColor}"></div>
    <div class="task-content">
      <div class="task-header">
        <h3 class="task-title ${task.status === 'concluido' ? 'completed-text' : ''}">${task.name}</h3>
        <div class="task-actions">
          <button class="task-btn check-btn" onclick="toggleTaskFromHome(${task.id})" title="Marcar como concluída">
            ✔
          </button>
          <button class="task-btn delete-btn" onclick="deleteTaskFromHome(${task.id})" title="Excluir tarefa">
            ✖
          </button>
        </div>
      </div>
      <div class="task-meta">
        <span class="task-priority" style="color: ${priorityColor}">Prioridade: ${priorityText}</span>
        <span class="task-date ${isOverdue ? 'overdue' : ''}">Prazo: ${formattedDate}</span>
      </div>
    </div>
  `;

  return taskDiv;
}

// ===== ALTERAR STATUS DE TAREFA =====
function toggleTaskFromHome(id) {
  const taskIndex = homeTasks.findIndex(t => t.id === id);
  if (taskIndex === -1) return;

  const task = homeTasks[taskIndex];
  task.status = task.status === 'concluido' ? 'pendente' : 'concluido';
  saveTasksToStorage();
  renderAllTasks();
}

// ===== EXCLUIR TAREFA =====
function deleteTaskFromHome(id) {
  homeTasks = homeTasks.filter(t => t.id !== id);
  saveTasksToStorage();
  renderAllTasks();
}

// ===== ATUALIZAR LOCALSTORAGE =====
function saveTasksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(homeTasks));
}

// ===== MONITORAR MUDANÇAS =====
function setupStorageListener() {
  window.addEventListener('storage', e => {
    if (e.key === STORAGE_KEY) {
      loadAndDisplayTasks();
    }
  });
}

// ===== ESTADO VAZIO =====
function showEmptyState() {
  const container = document.getElementById('tasksContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state">
      <p>🎯 Nenhuma tarefa cadastrada ainda!</p>
    </div>
  `;
  updateTaskCounter();
}

// ===== ATUALIZAR CONTADOR =====
function updateTaskCounter() {
  const counter = document.getElementById('taskCounter');
  if (counter) {
    const pending = homeTasks.filter(t => t.status !== 'concluido').length;
    counter.textContent = `${pending} tarefa(s) pendente(s)`;
  }
}
