let clientes = [];

// Inicializar dados ao carregar
window.onload = function () {
  carregarDadosDoFirestore();
};

// Firebase Firestore
const db = firebase.firestore();

function carregarDadosDoFirestore() {
  db.collection("clientes").get()
    .then(snapshot => {
      clientes = [];
      snapshot.forEach(doc => clientes.push({ ...doc.data(), id: doc.id }));
      filtrarEventosPorData();
    })
    .catch(error => console.error("Erro ao carregar do Firestore:", error));
}

document.getElementById("formCadastroCompleto").addEventListener("submit", function (e) {
  e.preventDefault();

  const novoCliente = {
    nome: document.getElementById("nome").value,
    telefone: document.getElementById("telefone").value,
    insta: document.getElementById("insta").value,
    endereco: document.getElementById("endereco").value,
    cpf: document.getElementById("cpf").value,
    evento: {
      tipo: document.getElementById("tipo").value,
      data: document.getElementById("dataEvento").value,
      valorTotal: parseFloat(document.getElementById("valorTotal").value),
      valorPago: parseFloat(document.getElementById("valorPago").value)
    }
  };

  db.collection("clientes").add(novoCliente)
    .then(() => {
      this.reset();
      document.getElementById("formularioCompleto").classList.add("hidden");
      carregarDadosDoFirestore();
    })
    .catch(err => console.error("Erro ao salvar:", err));
});

function abrirCadastroCompleto() {
  document.getElementById("formularioCompleto").classList.remove("hidden");
  document.getElementById("listaEventos").classList.add("hidden");
  document.getElementById("buscaCliente").classList.add("hidden");
}

function visualizarEventosAgendados() {
  document.getElementById("listaEventos").classList.remove("hidden");
  document.getElementById("formularioCompleto").classList.add("hidden");
  document.getElementById("buscaCliente").classList.add("hidden");
  filtrarEventosPorData();
}

function abrirBuscaCliente() {
  document.getElementById("buscaCliente").classList.remove("hidden");
  document.getElementById("listaEventos").classList.add("hidden");
  document.getElementById("formularioCompleto").classList.add("hidden");
}

function filtrarEventosPorData() {
  const filtro = document.getElementById('filtroData').value;
  const lista = document.getElementById('eventosFiltrados');
  lista.innerHTML = '';

  let filtrados = filtro ? clientes.filter(c => c.evento.data === filtro) : clientes.slice();
  filtrados.sort((a, b) => new Date(b.evento.data) - new Date(a.evento.data));

  filtrados.forEach((c, idx) => {
    const li = document.createElement('li');
    const pendente = c.evento.valorTotal - c.evento.valorPago;
    li.textContent = `${c.nome} - ${c.evento.tipo} em ${c.evento.data} | Pago: R$${c.evento.valorPago} | Faltante: R$${pendente.toFixed(2)}`;
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => mostrarDetalhesEvento(clientes.indexOf(c)));
    lista.appendChild(li);
  });
}

function mostrarDetalhesEvento(index) {
  const c = clientes[index];
  alert(
    `Cliente: ${c.nome}\nTelefone: ${c.telefone}\nInstagram: ${c.insta}\nEndereço: ${c.endereco}\nCPF: ${c.cpf}\n` +
    `Evento: ${c.evento.tipo} em ${c.evento.data}\nValor Total: R$${c.evento.valorTotal}\nValor Pago: R$${c.evento.valorPago}\n` +
    `Faltante: R$${(c.evento.valorTotal - c.evento.valorPago).toFixed(2)}`
  );
}

function buscarClientePorNome() {
  const nomeBusca = document.getElementById("nomeBusca").value.toLowerCase();
  const resultado = document.getElementById("resultadoBusca");
  resultado.innerHTML = '';

  const encontrados = clientes.filter(c => c.nome.toLowerCase().includes(nomeBusca));
  if (encontrados.length === 0) {
    resultado.textContent = "Nenhum cliente encontrado.";
    return;
  }

  encontrados.forEach(c => {
    const div = document.createElement("div");
    const pendente = c.evento.valorTotal - c.evento.valorPago;
    div.innerHTML = `
      <strong>${c.nome}</strong><br>
      📞 ${c.telefone}<br>
      📷 ${c.insta}<br>
      📍 ${c.endereco}<br>
      🆔 ${c.cpf}<br>
      📅 Evento: ${c.evento.tipo} em ${c.evento.data}<br>
      💰 Valor Total: R$${c.evento.valorTotal} | Pago: R$${c.evento.valorPago} | Faltante: R$${pendente.toFixed(2)}<hr>
    `;
    resultado.appendChild(div);
  });
}

// Expor funções globalmente para funcionar com onclick
window.abrirCadastroCompleto = abrirCadastroCompleto;
window.visualizarEventosAgendados = visualizarEventosAgendados;
window.abrirBuscaCliente = abrirBuscaCliente;
window.filtrarEventosPorData = filtrarEventosPorData;
window.buscarClientePorNome = buscarClientePorNome;
