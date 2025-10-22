/* ========================================
   SISTEMA DE TAREFAS SINCRONIZADO - TELA PRINCIPAL
   Arquivo: localstorage.js
   Sincroniza com Tela_Gerenciamento.html
   ======================================== */

// ===== CONFIGURAÇÃO DO STORAGE =====
const STORAGE_KEY = 'nura_tasks';
const COUNTER_KEY = 'nura_task_counter';

// ===== VARIÁVEIS GLOBAIS =====
let tasks = [];
let taskIdCounter = 0;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
  loadTasksFromStorage();
  initializeElements();
  renderSimpleTasks();
});

// ===== INICIALIZAR ELEMENTOS =====
function initializeElements() {
  const btnAdicionar = document.getElementById('btnAdicionar');
  const btnSalvar = document.getElementById('btnSalvar');
  const btnCancelar = document.getElementById('btnCancelar');
  const blocoTarefas = document.getElementById('blocoTarefas');
  const textarea = document.getElementById('textareaTarefa');
  
  // Botão Adicionar - Mostra textarea
  if (btnAdicionar) {
    btnAdicionar.addEventListener('click', function() {
      blocoTarefas.classList.remove('escondido');
      blocoTarefas.classList.add('visivel');
      textarea.focus();
    });
  }
  
  // Botão Salvar - Cria tarefa simples
  if (btnSalvar) {
    btnSalvar.addEventListener('click', function() {
      const taskName = textarea.value.trim();
      
      if (taskName) {
        // Cria tarefa com valores padrão
        const newTask = {
          id: ++taskIdCounter,
          name: taskName,
          responsible: 'Você',
          dueDate: new Date().toISOString().split('T')[0],
          priority: 'medium',
          status: 'pendente'
        };
        
        tasks.push(newTask);
        saveTasksToStorage();
        renderSimpleTasks();
        
        // Limpa e esconde formulário
        textarea.value = '';
        blocoTarefas.classList.remove('visivel');
        blocoTarefas.classList.add('escondido');
        
        showNotification('✅ Tarefa adicionada!');
      } else {
        alert('Por favor, digite uma tarefa!');
      }
    });
  }
  
  // Botão Cancelar
  if (btnCancelar) {
    btnCancelar.addEventListener('click', function() {
      textarea.value = '';
      blocoTarefas.classList.remove('visivel');
      blocoTarefas.classList.add('escondido');
    });
  }
  
  // Enter para salvar
  if (textarea) {
    textarea.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        btnSalvar.click();
      }
    });
  }
  
  // Menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('show');
    });
  }
}

// ===== RENDERIZAR TAREFAS SIMPLES =====
function renderSimpleTasks() {
  const listaTarefas = document.getElementById('listaTarefas');
  
  if (!listaTarefas) return;
  
  // Limpa lista
  listaTarefas.innerHTML = '';
  
  if (tasks.length === 0) {
    listaTarefas.innerHTML = '<p class="text-muted text-center">Nenhuma tarefa adicionada ainda.</p>';
    return;
  }
  
  // Renderiza cada tarefa
  tasks.forEach(task => {
    const item = document.createElement('div');
    item.className = 'list-group-item';
    item.setAttribute('data-task-id', task.id);
    
    // Ícone de status
    const statusIcon = task.status === 'concluido' ? '✅' : 
                       task.status === 'progresso' ? '🔄' : '⏳';
    
    item.innerHTML = `
      <span>${statusIcon} ${task.name}</span>
      <div class="btn-group">
        <button class="btn btn-sm btn-outline-success" onclick="completeSimpleTask(${task.id})">
          ✓
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteSimpleTask(${task.id})">
          🗑️
        </button>
      </div>
    `;
    
    listaTarefas.appendChild(item);
  });
}

// ===== COMPLETAR TAREFA SIMPLES =====
function completeSimpleTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  
  // Alterna status
  if (task.status === 'concluido') {
    task.status = 'pendente';
  } else {
    task.status = 'concluido';
  }
  
  saveTasksToStorage();
  renderSimpleTasks();
  showNotification(task.status === 'concluido' ? '✅ Tarefa concluída!' : '⏳ Tarefa reaberta!');
}

// ===== EXCLUIR TAREFA SIMPLES =====
function deleteSimpleTask(taskId) {
  if (confirm('Deseja excluir esta tarefa?')) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasksToStorage();
    renderSimpleTasks();
    showNotification('🗑️ Tarefa excluída!');
  }
}

// ===== LOCALSTORAGE: SALVAR =====
function saveTasksToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    localStorage.setItem(COUNTER_KEY, taskIdCounter.toString());
    console.log('✅ Tarefas salvas:', tasks.length);
  } catch (error) {
    console.error('❌ Erro ao salvar:', error);
  }
}

// ===== LOCALSTORAGE: CARREGAR =====
function loadTasksFromStorage() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
      console.log('✅ Tarefas carregadas:', tasks.length);
    }
    
    const savedCounter = localStorage.getItem(COUNTER_KEY);
    if (savedCounter) {
      taskIdCounter = parseInt(savedCounter);
    }
  } catch (error) {
    console.error('❌ Erro ao carregar:', error);
    tasks = [];
    taskIdCounter = 0;
  }
}

// ===== NOTIFICAÇÃO =====
function showNotification(message) {
  // Cria elemento de notificação
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #49a09d;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    font-weight: 600;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove após 3 segundos
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== TORNA FUNÇÕES GLOBAIS =====
window.completeSimpleTask = completeSimpleTask;
window.deleteSimpleTask = deleteSimpleTask;