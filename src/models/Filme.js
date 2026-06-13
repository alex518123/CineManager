class Filme {
  constructor({ id, titulo, genero, duracao, classificacao, anoLancamento, sinopse, status, poster }) {
    this.id = id;
    this.titulo = titulo;
    this.genero = genero;
    this.duracao = duracao;
    this.classificacao = classificacao;
    this.anoLancamento = anoLancamento;
    this.sinopse = sinopse;
    this.status = status;
    this.poster = poster || null;
  }

  estaEmCartaz() {
    return this.status === 'Em Cartaz';
  }

  obterDuracaoFormatada() {
    const horas = Math.floor(this.duracao / 60);
    const minutos = this.duracao % 60;
    if (horas === 0) return \\min\;
    if (minutos === 0) return \\h\;
    return \\h \min\;
  }
}

export { Filme };
