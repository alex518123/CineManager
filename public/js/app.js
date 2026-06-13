import { Api } from './api.js';


class App {
  static formatarDuracao(minutos) {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  }
  constructor() {
    this.api = new Api();
    this.filmes = [];
    this.filtroStatus = 'todos';
    this.searchTerm = '';
    this.sortField = 'titulo';
    this.sortOrder = 'asc';
    this.currentPage = 1;
    this.pageSize = 10;
    this.editingId = null;
    this.deletingId = null;

    this.cacheElements();
    this.bindEvents();
    this.initLenis();
    this.carregarFilmes();
  }

  cacheElements() {
    this.els = {
      stats: document.getElementById('stats'),
      statTotal: document.getElementById('stat-total'),
      statCartaz: document.getElementById('stat-em-cartaz'),
      statBreve: document.getElementById('stat-em-breve'),
      statEncerrado: document.getElementById('stat-encerrado'),
      tableBody: document.getElementById('table-body'),
      tableInfo: document.getElementById('table-info'),
      pagination: document.getElementById('pagination'),
      search: document.getElementById('search'),
      tabs: document.querySelectorAll('.tab'),
      btnNovo: document.getElementById('btn-novo'),
      modalOverlay: document.getElementById('modal-overlay'),
      modal: document.getElementById('modal'),
      modalTitle: document.getElementById('modal-title'),
      modalForm: document.getElementById('modal-form'),
      modalSubmit: document.getElementById('modal-submit'),
      modalCancel: document.getElementById('modal-cancel'),
      modalClose: document.getElementById('modal-close'),
      confirmOverlay: document.getElementById('confirm-overlay'),
      confirmFilmeName: document.getElementById('confirm-filme-name'),
      confirmCancel: document.getElementById('confirm-cancel'),
      confirmDelete: document.getElementById('confirm-delete'),
      toastContainer: document.getElementById('toast-container')
    };
  }

  bindEvents() {
    this.els.search.addEventListener('input', () => {
      this.searchTerm = this.els.search.value;
      this.currentPage = 1;
      this.render();
    });

    this.els.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.els.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.filtroStatus = tab.dataset.filter;
        this.currentPage = 1;
        this.render();
      });
    });

    document.querySelectorAll('.table th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const field = th.dataset.sort;
        if (this.sortField === field) {
          this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortField = field;
          this.sortOrder = 'asc';
        }
        document.querySelectorAll('.table th').forEach(h => {
          h.classList.remove('sort-asc', 'sort-desc');
        });
        th.classList.add(`sort-${this.sortOrder}`);
        this.render();
      });
    });

    this.els.btnNovo.addEventListener('click', () => this.abrirModal());

    this.els.modalForm.addEventListener('submit', (e) => this.handleSubmit(e));
    this.els.modalCancel.addEventListener('click', () => this.fecharModal());
    this.els.modalClose.addEventListener('click', () => this.fecharModal());
    this.els.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.els.modalOverlay) this.fecharModal();
    });

    this.els.confirmCancel.addEventListener('click', () => this.fecharConfirm());
    this.els.confirmDelete.addEventListener('click', () => this.handleDelete());
    this.els.confirmOverlay.addEventListener('click', (e) => {
      if (e.target === this.els.confirmOverlay) this.fecharConfirm();
    });
  }

  initLenis() {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      smoothWheel: true
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  async carregarFilmes() {
    try {
      this.filmes = await this.api.listar();
      this.render();
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  }

  get filmesFiltrados() {
    let filmes = [...this.filmes];

    if (this.filtroStatus !== 'todos') {
      filmes = filmes.filter(f => f.status === this.filtroStatus);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filmes = filmes.filter(f => f.titulo.toLowerCase().includes(term));
    }

    filmes.sort((a, b) => {
      let valA = a[this.sortField];
      let valB = b[this.sortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
        return this.sortOrder === 'asc' ? valA.localeCompare(valB, 'pt-BR') : valB.localeCompare(valA, 'pt-BR');
      }

      return this.sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return filmes;
  }

  get filmesPaginados() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filmesFiltrados.slice(start, start + this.pageSize);
  }

  get totalPaginas() {
    return Math.ceil(this.filmesFiltrados.length / this.pageSize);
  }

  render() {
    this.renderStats();
    this.renderTabela();
    this.renderPaginacao();
  }

  async renderStats() {
    try {
      const stats = await this.api.obterStats();
      this.animarNumero(this.els.statTotal, stats.total);
      this.animarNumero(this.els.statCartaz, stats.emCartaz);
      this.animarNumero(this.els.statBreve, stats.emBreve);
      this.animarNumero(this.els.statEncerrado, stats.encerrado);
    } catch {
      this.animarNumero(this.els.statTotal, this.filmes.length);
      this.animarNumero(this.els.statCartaz, this.filmes.filter(f => f.status === 'Em Cartaz').length);
      this.animarNumero(this.els.statBreve, this.filmes.filter(f => f.status === 'Em Breve').length);
      this.animarNumero(this.els.statEncerrado, this.filmes.filter(f => f.status === 'Encerrado').length);
    }
  }

  animarNumero(el, alvo) {
    const atual = parseInt(el.textContent) || 0;
    if (atual === alvo) return;
    const duracao = 600;
    const inicio = performance.now();

    function animar(agora) {
      const decorrido = agora - inicio;
      const progresso = Math.min(decorrido / duracao, 1);
      const easeOut = 1 - Math.pow(1 - progresso, 3);
      const valor = Math.round(atual + (alvo - atual) * easeOut);
      el.textContent = valor;
      if (progresso < 1) requestAnimationFrame(animar);
    }

    requestAnimationFrame(animar);
  }

  renderTabela() {
    const filmes = this.filmesPaginados;

    if (filmes.length === 0) {
      this.els.tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">Nenhum filme encontrado</td></tr>';
      this.els.tableInfo.textContent = '0 resultados';
      return;
    }

    const total = this.filmesFiltrados.length;
    const inicio = (this.currentPage - 1) * this.pageSize + 1;
    const fim = Math.min(this.currentPage * this.pageSize, total);
    this.els.tableInfo.textContent = `${inicio}-${fim} de ${total} filmes`;

    this.els.tableBody.innerHTML = filmes.map(f => {
      
      return `
        <tr>
          <td class="cell-title">${f.titulo}</td>
          <td>${f.genero}</td>
          <td>${App.formatarDuracao(f.duracao)}</td>
          <td><span class="class-badge class-${f.classificacao.toString().toLowerCase()}">${f.classificacao}</span></td>
          <td>${f.anoLancamento}</td>
          <td><span class="status-badge status-${f.status.replace(/\s/g, '-')}">${f.status}</span></td>
          <td class="cell-actions">
            <button class="btn-icon" data-editar="${f.id}" title="Editar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn-icon btn-icon-danger" data-excluir="${f.id}" title="Excluir">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    document.querySelectorAll('[data-editar]').forEach(btn => {
      btn.addEventListener('click', () => this.abrirModal(Number(btn.dataset.editar)));
    });

    document.querySelectorAll('[data-excluir]').forEach(btn => {
      btn.addEventListener('click', () => this.abrirConfirm(Number(btn.dataset.excluir)));
    });
  }

  renderPaginacao() {
    const total = this.totalPaginas;
    if (total <= 1) {
      this.els.pagination.innerHTML = '';
      return;
    }

    let html = '';
    html += `<button class="page-btn" data-page="${this.currentPage - 1}" ${this.currentPage === 1 ? 'disabled' : ''}>Anterior</button>`;

    for (let i = 1; i <= total; i++) {
      html += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    html += `<button class="page-btn" data-page="${this.currentPage + 1}" ${this.currentPage === total ? 'disabled' : ''}>Proximo</button>`;

    this.els.pagination.innerHTML = html;

    this.els.pagination.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        this.currentPage = Number(btn.dataset.page);
        this.render();
      });
    });
  }

  abrirModal(id = null) {
    this.editingId = id;
    this.els.modalForm.reset();

    if (id) {
      this.els.modalTitle.textContent = 'Editar Filme';
      this.els.modalSubmit.textContent = 'Salvar';
      const filme = this.filmes.find(f => f.id === id);
      if (filme) {
        document.getElementById('titulo').value = filme.titulo;
        document.getElementById('genero').value = filme.genero;
        document.getElementById('duracao').value = filme.duracao;
        document.getElementById('classificacao').value = filme.classificacao;
        document.getElementById('anoLancamento').value = filme.anoLancamento;
        document.getElementById('sinopse').value = filme.sinopse;
        document.getElementById('status').value = filme.status;
      }
    } else {
      this.els.modalTitle.textContent = 'Novo Filme';
      this.els.modalSubmit.textContent = 'Salvar';
    }

    this.els.modalOverlay.classList.add('open');
  }

  fecharModal() {
    this.els.modalOverlay.classList.remove('open');
    this.editingId = null;
  }

  async handleSubmit(e) {
    e.preventDefault();
    const dados = {
      titulo: document.getElementById('titulo').value.trim(),
      genero: document.getElementById('genero').value.trim(),
      duracao: Number(document.getElementById('duracao').value),
      classificacao: document.getElementById('classificacao').value,
      anoLancamento: Number(document.getElementById('anoLancamento').value),
      sinopse: document.getElementById('sinopse').value.trim(),
      status: document.getElementById('status').value
    };

    try {
      if (this.editingId) {
        await this.api.atualizar(this.editingId, dados);
        this.mostrarToast('Filme atualizado com sucesso!', 'success');
      } else {
        await this.api.criar(dados);
        this.mostrarToast('Filme cadastrado com sucesso!', 'success');
      }
      this.fecharModal();
      await this.carregarFilmes();
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  }

  abrirConfirm(id) {
    this.deletingId = id;
    const filme = this.filmes.find(f => f.id === id);
    this.els.confirmFilmeName.textContent = filme ? filme.titulo : 'este filme';
    this.els.confirmOverlay.classList.add('open');
  }

  fecharConfirm() {
    this.els.confirmOverlay.classList.remove('open');
    this.deletingId = null;
  }

  async handleDelete() {
    if (!this.deletingId) return;
    try {
      await this.api.excluir(this.deletingId);
      this.mostrarToast('Filme excluido com sucesso!', 'success');
      this.fecharConfirm();
      await this.carregarFilmes();
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  }

  mostrarToast(mensagem, tipo = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.textContent = mensagem;
    this.els.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

new App();
