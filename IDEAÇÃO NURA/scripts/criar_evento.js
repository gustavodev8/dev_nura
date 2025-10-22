/* ========================================
   SISTEMA DE GERENCIAMENTO DE TAREFAS - SINCRONIZADO
   Arquivo: criar_evento.js
   Sincroniza com TelaPrincipal.html
   ======================================== */

// ===== VARIÁVEIS GLOBAIS =====
let tasks = [];
let taskIdCounter = 0;
let currentEditingTask = null;
const STORAGE_KEY = 'nura_tasks';
const COUNTER_KEY = 'nura_task_counter';

// ===== INICIALIZAÇÃO DO SISTEMA =====
document.addEventListener('DOMContentLoaded', function() {
  loadTasksFromStorage();
  initializeEventListeners();
  renderAllTasks();
  updateTaskCounts();
  initializeGroupToggles();
  initializeMenuToggle();
  
  // Atualiza a cada 2 segundos para sincronizar mudanças de outras abas
  setInterval(checkForUpdates, 2000);
});

// ===== VERIFICAR ATUALIZAÇÕES =====
let lastTasksString = '';

function checkForUpdates() {
  const currentTasksString = localStorage.getItem(STORAGE_KEY);
  
  if (currentTasksString !== lastTasksString && lastTasksString !== '') {
    console.log('🔄 Mudanças detectadas, recarregando...');
    loadTasksFromStorage();
    renderAllTasks();
    updateTaskCounts();
  }
  
  lastTasksString = currentTasksString;
}

// ===== CONFIGURAÇÃO DE EVENT LISTENERS =====
function initializeEventListeners() {
  const btnAdicionar = document.getElementById('btnAdicionar');
  if (btnAdicionar) {
    btnAdicionar.addEventListener('click', addNewTask);
  }
}

// ===== MENU RESPONSIVO =====
function initializeMenuToggle() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('show');
    });
  }
}

// ===== LOCALSTORAGE: SALVAR TAREFAS =====
function saveTasksToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    localStorage.setItem(COUNTER_KEY, taskIdCounter.toString());
    lastTasksString = localStorage.getItem(STORAGE_KEY);
    console.log('✅ Tarefas salvas no LocalStorage:', tasks.length, 'tarefas');
  } catch (error) {
    console.error('❌ Erro ao salvar tarefas:', error);
    showNotification('⚠️ Erro ao salvar dados!');
  }
}

// ===== LOCALSTORAGE: CARREGAR TAREFAS =====
function loadTasksFromStorage() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
      console.log('✅ Tarefas carregadas:', tasks.length, 'tarefas');
    }
    
    const savedCounter = localStorage.getItem(COUNTER_KEY);
    if (savedCounter) {
      taskIdCounter = parseInt(savedCounter);
      console.log('✅ Contador carregado:', taskIdCounter);
    }
    
    lastTasksString = savedTasks;
  } catch (error) {
    console.error('❌ Erro ao carregar tarefas:', error);
    tasks = [];
    taskIdCounter = 0;
  }
}

// ===== RENDERIZAR TODAS AS TAREFAS =====
function renderAllTasks() {
  // Limpa todas as tarefas existentes
  document.querySelectorAll('.task-row').forEach(row => row.remove());
  
  // Renderiza cada tarefa
  tasks.forEach(task => {
    renderTask(task);
  });
}

// ===== LOCALSTORAGE: LIMPAR DADOS =====
function clearStorage() {
  if (confirm('⚠️ Deseja realmente excluir TODAS as tarefas? Esta ação não pode ser desfeita!')) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COUNTER_KEY);
    tasks = [];
    taskIdCounter = 0;
    lastTasksString = '';
    
    document.querySelectorAll('.task-row').forEach(row => row.remove());
    updateTaskCounts();
    
    showNotification('🗑️ Todas as tarefas foram excluídas!');
    console.log('✅ Storage limpo');
  }
}

// ===== CONTROLE DE GRUPOS =====
function initializeGroupToggles() {
  const groupHeaders = document.querySelectorAll('.group-header');
  
  groupHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const taskTable = this.nextElementSibling;
      const toggle = this.querySelector('.group-toggle');
      
      if (taskTable.style.display === 'none') {
        taskTable.style.display = 'block';
        toggle.textContent = '▼';
      } else {
        taskTable.style.display = 'none';
        toggle.textContent = '▶';
      }
    });
  });
}

// ===== CRIAR NOVA TAREFA =====
function addNewTask() {
  currentEditingTask = null;
  showNameModal();
}

// ===== MODAL DE NOME =====
function showNameModal() {
  const modal = createModal({
    title: '📝 Nome da Tarefa',
    content: `
      <input 
        type="text" 
        id="taskNameInput" 
        class="modal-input" 
        placeholder="Digite o nome da tarefa..."
        maxlength="100"
      />
    `,
    buttons: [
      {
        text: 'Próximo',
        class: 'btn-primary',
        onClick: () => {
          const name = document.getElementById('taskNameInput').value.trim();
          if (name) {
            if (!currentEditingTask) {
              currentEditingTask = { id: ++taskIdCounter };
            }
            currentEditingTask.name = name;
            closeModal();
            showResponsibleModal();
          } else {
            alert('Por favor, digite um nome para a tarefa!');
          }
        }
      },
      {
        text: 'Cancelar',
        class: 'btn-secondary',
        onClick: () => {
          closeModal();
          currentEditingTask = null;
        }
      }
    ]
  });
  
  setTimeout(() => {
    const input = document.getElementById('taskNameInput');
    if (input) input.focus();
  }, 100);
}

// ===== MODAL DE RESPONSÁVEL =====
function showResponsibleModal() {
  const modal = createModal({
    title: '👤 Responsável',
    content: `
      <input 
        type="text" 
        id="taskResponsibleInput" 
        class="modal-input" 
        placeholder="Digite o nome do responsável..."
        maxlength="50"
      />
    `,
    buttons: [
      {
        text: 'Próximo',
        class: 'btn-primary',
        onClick: () => {
          const responsible = document.getElementById('taskResponsibleInput').value.trim();
          if (responsible) {
            currentEditingTask.responsible = responsible;
            closeModal();
            showDateModal();
          } else {
            alert('Por favor, digite o nome do responsável!');
          }
        }
      },
      {
        text: 'Voltar',
        class: 'btn-secondary',
        onClick: () => {
          closeModal();
          showNameModal();
        }
      }
    ]
  });
  
  setTimeout(() => {
    const input = document.getElementById('taskResponsibleInput');
    if (input) input.focus();
  }, 100);
}

// ===== MODAL DE DATA =====
function showDateModal() {
  const today = new Date().toISOString().split('T')[0];
  
  const modal = createModal({
    title: '📅 Data de Vencimento',
    content: `
      <input 
        type="date" 
        id="taskDateInput" 
        class="modal-input" 
        min="${today}"
        value="${today}"
      />
      <p style="font-size: 0.9rem; color: var(--gray); margin-top: 0.5rem;">
        📌 Data selecionada: <span id="selectedDateDisplay">${formatDate(today)}</span>
      </p>
    `,
    buttons: [
      {
        text: 'Próximo',
        class: 'btn-primary',
        onClick: () => {
          handleDateConfirm();
        }
      },
      {
        text: 'Voltar',
        class: 'btn-secondary',
        onClick: () => {
          closeModal();
          showResponsibleModal();
        }
      }
    ]
  });
  
  setTimeout(() => {
    const input = document.getElementById('taskDateInput');
    const display = document.getElementById('selectedDateDisplay');
    
    if (input && display) {
      input.addEventListener('change', function() {
        display.textContent = formatDate(this.value);
      });
    }
  }, 100);
}

// ===== CONFIRMAR DATA =====
function handleDateConfirm() {
  const dateInput = document.getElementById('taskDateInput');
  
  if (!dateInput) {
    alert('Erro ao carregar o campo de data. Tente novamente!');
    return;
  }
  
  const date = dateInput.value;
  
  if (!date || date === '') {
    alert('Por favor, escolha uma data!');
    return;
  }
  
  currentEditingTask.dueDate = date;
  closeModal();
  showPriorityModal();
}

// ===== FORMATAR DATA =====
function formatDate(dateString) {
  if (!dateString) return 'Não selecionada';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

// ===== MODAL DE PRIORIDADE =====
function showPriorityModal() {
  const modal = createModal({
    title: '⚡ Prioridade',
    content: `
      <div class="priority-options">
        <button class="priority-option priority-high" data-priority="high">
          🔴 Alta
        </button>
        <button class="priority-option priority-medium" data-priority="medium">
          🟡 Média
        </button>
        <button class="priority-option priority-low" data-priority="low">
          🟢 Baixa
        </button>
      </div>
    `,
    buttons: [
      {
        text: 'Voltar',
        class: 'btn-secondary',
        onClick: () => {
          closeModal();
          showDateModal();
        }
      }
    ]
  });
  
  const priorityOptions = document.querySelectorAll('.priority-option');
  priorityOptions.forEach(option => {
    option.addEventListener('click', function() {
      const priority = this.getAttribute('data-priority');
      currentEditingTask.priority = priority;
      closeModal();
      showStatusModal();
    });
  });
}

// ===== MODAL DE STATUS =====
function showStatusModal() {
  const modal = createModal({
    title: '📊 Status da Tarefa',
    content: `
      <div class="status-options">
        <button class="status-option status-progress" data-status="progresso">
          🔄 Em Progresso
        </button>
        <button class="status-option status-pending" data-status="pendente">
          ⏳ Pendente
        </button>
        <button class="status-option status-completed" data-status="concluido">
          ✅ Concluído
        </button>
      </div>
    `,
    buttons: [
      {
        text: 'Voltar',
        class: 'btn-secondary',
        onClick: () => {
          closeModal();
          showPriorityModal();
        }
      }
    ]
  });
  
  const statusOptions = document.querySelectorAll('.status-option');
  statusOptions.forEach(option => {
    option.addEventListener('click', function() {
      const status = this.getAttribute('data-status');
      currentEditingTask.status = status;
      closeModal();
      saveTask();
    });
  });
}

// ===== SALVAR TAREFA =====
function saveTask() {
  tasks.push(currentEditingTask);
  renderTask(currentEditingTask);
  updateTaskCounts();
  saveTasksToStorage();
  
  currentEditingTask = null;
  showNotification('✅ Tarefa criada com sucesso!');
}

// ===== RENDERIZAR TAREFA =====
function renderTask(task) {
  const taskGroup = document.querySelector(`.task-group[data-status="${task.status}"]`);
  const taskTable = taskGroup.querySelector('.task-table');
  const addTaskBtn = taskTable.querySelector('.add-task');
  
  const taskRow = document.createElement('div');
  taskRow.className = 'task-row';
  taskRow.setAttribute('data-task-id', task.id);
  
  const dateObj = new Date(task.dueDate + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('pt-BR');
  
  const priorityClass = `priority-${task.priority}`;
  const priorityText = {
    'high': 'Alta',
    'medium': 'Média',
    'low': 'Baixa'
  }[task.priority];
  
  const statusClass = task.status === 'progresso' ? 'progress' : task.status === 'pendente' ? 'pending' : 'completed';
  const statusText = {
    'progresso': 'Em Progresso',
    'pendente': 'Pendente',
    'concluido': 'Concluído'
  }[task.status];
  
  const avatarLetter = task.responsible.charAt(0).toUpperCase();
  
  taskRow.innerHTML = `
    <div class="task-checkbox ${task.status === 'concluido' ? 'checked' : ''}" onclick="toggleTaskComplete(${task.id})"></div>
    <div class="task-name">${task.name}</div>
    <div class="task-assignee">
      <div class="avatar">${avatarLetter}</div>
      <span>${task.responsible}</span>
    </div>
    <div class="task-date">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      ${formattedDate}
    </div>
    <div>
      <span class="priority-badge ${priorityClass}">${priorityText}</span>
    </div>
    <div>
      <span class="status-badge ${statusClass}">${statusText}</span>
    </div>
    <div>
      <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${task.id})">
        🗑️ Excluir
      </button>
    </div>
  `;
  
  taskTable.insertBefore(taskRow, addTaskBtn);
}

// ===== ALTERNAR CONCLUSÃO =====
function toggleTaskComplete(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  
  if (task.status === 'concluido') {
    task.status = 'pendente';
  } else {
    task.status = 'concluido';
  }
  
  const taskRow = document.querySelector(`.task-row[data-task-id="${taskId}"]`);
  if (taskRow) {
    taskRow.remove();
  }
  
  renderTask(task);
  updateTaskCounts();
  saveTasksToStorage();
}

// ===== EXCLUIR TAREFA =====
function deleteTask(taskId) {
  if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
    tasks = tasks.filter(t => t.id !== taskId);
    const taskRow = document.querySelector(`.task-row[data-task-id="${taskId}"]`);
    if (taskRow) {
      taskRow.remove();
    }
    updateTaskCounts();
    saveTasksToStorage();
    showNotification('🗑️ Tarefa excluída!');
  }
}

// ===== ATUALIZAR CONTADORES =====
function updateTaskCounts() {
  const statuses = ['progresso', 'pendente', 'concluido'];
  
  statuses.forEach(status => {
    const count = tasks.filter(t => t.status === status).length;
    const group = document.querySelector(`.task-group[data-status="${status}"]`);
    if (group) {
      const countElement = group.querySelector('.group-count');
      if (countElement) {
        countElement.textContent = count;
      }
    }
  });
}

// ===== SISTEMA DE MODAIS =====
function createModal({ title, content, buttons }) {
  const existingModal = document.getElementById('dynamicModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  const modal = document.createElement('div');
  modal.id = 'dynamicModal';
  modal.className = 'modal';
  
  const buttonsHTML = buttons.map((btn, index) => 
    `<button class="btn ${btn.class}" data-btn-index="${index}">${btn.text}</button>`
  ).join('');
  
  modal.innerHTML = `
    <div class="modal-content">
      <h3>${title}</h3>
      ${content}
      <div class="modal-buttons">
        ${buttonsHTML}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  buttons.forEach((btn, index) => {
    const btnElement = modal.querySelector(`[data-btn-index="${index}"]`);
    if (btnElement) {
      btnElement.addEventListener('click', btn.onClick);
    }
  });
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
      currentEditingTask = null;
    }
  });
  
  return modal;
}

// ===== FECHAR MODAL =====
function closeModal() {
  const modal = document.getElementById('dynamicModal');
  if (modal) {
    modal.remove();
  }
}

// ===== NOTIFICAÇÕES =====
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== PLACEHOLDERS =====
function addNewStatus() {
  alert('Funcionalidade em desenvolvimento!');
}

function toggleView() {
  alert('Visualizações alternativas em desenvolvimento!');
}

// ===== DEBUG =====
function getStorageInfo() {
  const tasksSize = new Blob([localStorage.getItem(STORAGE_KEY) || '']).size;
  const totalSize = new Blob([JSON.stringify(localStorage)]).size;
  
  console.log('📊 === INFORMAÇÕES DO STORAGE ===');
  console.log('📝 Total de tarefas:', tasks.length);
  console.log('🔢 Próximo ID:', taskIdCounter + 1);
  console.log('💾 Tamanho das tarefas:', (tasksSize / 1024).toFixed(2), 'KB');
  console.log('💾 Tamanho total do storage:', (totalSize / 1024).toFixed(2), 'KB');
  console.log('📋 Tarefas por status:');
  console.log('  - Em Progresso:', tasks.filter(t => t.status === 'progresso').length);
  console.log('  - Pendente:', tasks.filter(t => t.status === 'pendente').length);
  console.log('  - Concluído:', tasks.filter(t => t.status === 'concluido').length);
  console.log('================================');
}

window.getStorageInfo = getStorageInfo;