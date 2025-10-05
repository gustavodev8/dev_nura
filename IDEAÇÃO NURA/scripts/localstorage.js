// Aguardar DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
  
  // ===== ELEMENTOS DO DOM =====
  const btnAdicionar = document.getElementById('btnAdicionar');
  const btnSalvar = document.getElementById('btnSalvar');
  const btnCancelar = document.getElementById('btnCancelar');
  const blocoTarefas = document.getElementById('blocoTarefas');
  const textarea = document.getElementById('textareaTarefa');
  const listaTarefas = document.getElementById('listaTarefas');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  // ===== ARRAY DE TAREFAS =====
  let tarefas = [];

  // ===== CARREGAR TAREFAS DO LOCALSTORAGE =====
  function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem('tarefas');
    if (tarefasSalvas) {
      tarefas = JSON.parse(tarefasSalvas);
      renderizarTarefas();
    }
  }

  // ===== SALVAR TAREFAS NO LOCALSTORAGE =====
  function salvarNoStorage() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }

  // ===== MENU RESPONSIVO =====
  menuToggle.addEventListener('click', function() {
    navMenu.classList.toggle('show');
  });

  // ===== MOSTRAR BLOCO DE ADICIONAR TAREFA =====
  btnAdicionar.addEventListener('click', function() {
    blocoTarefas.classList.remove('escondido');
    blocoTarefas.classList.add('visivel');
    textarea.value = '';
    textarea.focus();
  });

  // ===== SALVAR TAREFA =====
  btnSalvar.addEventListener('click', function() {
    const textoTarefa = textarea.value.trim();
    
    // Validação: verifica se o campo está vazio
    if (textoTarefa === '') {
      alert('Por favor, escreva uma tarefa antes de salvar!');
      return;
    }

    // Cria objeto da nova tarefa
    const novaTarefa = {
      id: Date.now(),           // ID único baseado no timestamp
      texto: textoTarefa,       // Texto digitado
      concluida: false          // Inicia como não concluída
    };
    
    // Adiciona ao array
    tarefas.push(novaTarefa);
    
    // Salva no localStorage
    salvarNoStorage();
    
    // Atualiza a interface
    renderizarTarefas();
    
    // Limpa e esconde o formulário
    textarea.value = '';
    blocoTarefas.classList.remove('visivel');
    blocoTarefas.classList.add('escondido');
  });

  // ===== CANCELAR ADIÇÃO DE TAREFA =====
  btnCancelar.addEventListener('click', function() {
    textarea.value = '';
    blocoTarefas.classList.remove('visivel');
    blocoTarefas.classList.add('escondido');
  });

  // ===== RENDERIZAR LISTA DE TAREFAS =====
  function renderizarTarefas() {
    // Limpa a lista atual
    listaTarefas.innerHTML = '';
    
    // Se não houver tarefas, mostra mensagem
    if (tarefas.length === 0) {
      listaTarefas.innerHTML = '<p class="text-muted text-center">Nenhuma tarefa adicionada ainda.</p>';
      return;
    }
    
    // Para cada tarefa, cria um elemento na tela
    tarefas.forEach(function(tarefa) {
      // Container da tarefa
      const tarefaDiv = document.createElement('div');
      tarefaDiv.className = 'list-group-item';
      
      // Texto da tarefa
      const textoSpan = document.createElement('span');
      textoSpan.textContent = tarefa.texto;
      
      // Aplica estilo se estiver concluída
      if (tarefa.concluida) {
        textoSpan.style.textDecoration = 'line-through';
        textoSpan.style.color = '#999';
      } else {
        textoSpan.style.textDecoration = 'none';
        textoSpan.style.color = '#333';
      }
      
      // Container dos botões
      const botoesDiv = document.createElement('div');
      botoesDiv.className = 'btn-group';
      
      // Botão de concluir/desconcluir
      const btnConcluir = document.createElement('button');
      btnConcluir.className = 'btn btn-sm btn-outline-success';
      btnConcluir.textContent = tarefa.concluida ? '↶' : '✓';
      btnConcluir.title = tarefa.concluida ? 'Marcar como pendente' : 'Marcar como concluída';
      btnConcluir.onclick = function() {
        tarefa.concluida = !tarefa.concluida;
        salvarNoStorage();
        renderizarTarefas();
      };
      
      // Botão de excluir
      const btnExcluir = document.createElement('button');
      btnExcluir.className = 'btn btn-sm btn-outline-danger';
      btnExcluir.textContent = '🗑';
      btnExcluir.title = 'Excluir tarefa';
      btnExcluir.onclick = function() {
        // Filtra o array removendo a tarefa com este ID
        tarefas = tarefas.filter(function(t) {
          return t.id !== tarefa.id;
        });
        salvarNoStorage();
        renderizarTarefas();
      };
      
      // Monta a estrutura
      botoesDiv.appendChild(btnConcluir);
      botoesDiv.appendChild(btnExcluir);
      
      tarefaDiv.appendChild(textoSpan);
      tarefaDiv.appendChild(botoesDiv);
      
      listaTarefas.appendChild(tarefaDiv);
    });
  }
  
  // ===== INICIALIZAR: CARREGAR TAREFAS SALVAS =====
  carregarTarefas();
  
});