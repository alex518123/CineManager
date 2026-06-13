class Api {
  constructor() {
    this.baseUrl = '/api/filmes';
  }

  async listar() {
    const res = await fetch(this.baseUrl);
    if (!res.ok) throw new Error('Erro ao listar filmes');
    return res.json();
  }

  async buscarPorId(id) {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (!res.ok) throw new Error('Filme nao encontrado');
    return res.json();
  }

  async criar(dados) {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.erros?.join(', ') || 'Erro ao criar filme');
    return data;
  }

  async atualizar(id, dados) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.erros?.join(', ') || 'Erro ao atualizar filme');
    return data;
  }

  async excluir(id) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Erro ao excluir filme');
  }

  async obterStats() {
    const res = await fetch(`${this.baseUrl}/stats`);
    if (!res.ok) throw new Error('Erro ao obter estatisticas');
    return res.json();
  }
}

export { Api };
