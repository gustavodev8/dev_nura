document.addEventListener("DOMContentLoaded", function () {
  const blocoTarefas = document.getElementById("blocoTarefas");
  const textarea = blocoTarefas.querySelector("textarea");
  const salvarBtn = blocoTarefas.querySelector("button");
  const btnAdicionar = document.getElementById("btnAdicionar"); // botão de adicionar

  // Cria lista visual para exibir tarefas
  let lista = document.createElement("ul");
  lista.classList.add("list-group", "mt-3");
  blocoTarefas.insertAdjacentElement("afterend", lista);

  // Função para carregar tarefas salvas
  function carregarTarefas() {
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    lista.innerHTML = "";
    tarefas.forEach((tarefa, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = tarefa;

      // Botão de remover
      const removerBtn = document.createElement("button");
      removerBtn.textContent = "✖️";
      removerBtn.className = "btn btn-sm btn-danger ms-2";
      removerBtn.onclick = () => {
        tarefas.splice(index, 1);
        localStorage.setItem("tarefas", JSON.stringify(tarefas));
        carregarTarefas();
      };

      li.appendChild(removerBtn);
      lista.appendChild(li);
    });
  }

  // Evento do botão Salvar
  salvarBtn.addEventListener("click", function () {
    const valor = textarea.value.trim();
    if (valor) {
      const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
      tarefas.push(valor);
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
      textarea.value = "";
      carregarTarefas();
    }
  });

  // Carrega as tarefas ao abrir a página
  carregarTarefas();

  // ==========================
  // NOVO: abrir/fechar caixa de adicionar tarefas
  // ==========================
  btnAdicionar.addEventListener("click", function () {
    blocoTarefas.classList.toggle("show"); // adiciona/remover a classe 'show' do CSS
    if (blocoTarefas.classList.contains("show")) {
      textarea.focus(); // opcional: foca no textarea ao abrir
    }
  });
});
