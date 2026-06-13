class FilmeService {
  constructor(filmeRepository) {
    this.filmeRepository = filmeRepository;
  }

  validar(dados) {
    const erros = [];

    if (!dados.titulo || dados.titulo.trim() === '') {
      erros.push('Titulo é obrigatorio');
    }

    if (!dados.genero || dados.genero.trim() === '') {
      erros.push('Genero é obrigatorio');
    }

    if (!dados.duracao || dados.duracao <= 0) {
      erros.push('Duracao deve ser maior que zero');
    }

    if (!dados.classificacao) {
      erros.push('Classificacao é obrigatoria');
    }

    if (!dados.anoLancamento || dados.anoLancamento < 1888 || dados.anoLancamento > 2100) {
      erros.push('Ano de lancamento invalido');
    }

    if (!dados.sinopse || dados.sinopse.trim() === '') {
      erros.push('Sinopse é obrigatoria');
    }

    const statusValidos = ['Em Cartaz', 'Em Breve', 'Encerrado'];
    if (!dados.status || !statusValidos.includes(dados.status)) {
      erros.push('Status invalido');
    }

    return erros;
  }

  criar(dados) {
    const erros = this.validar(dados);
    if (erros.length > 0) {
      return { sucesso: false, erros };
    }
    const filme = this.filmeRepository.criar(dados);
    return { sucesso: true, dados: filme };
  }

  listar() {
    return this.filmeRepository.listar();
  }

  buscarPorId(id) {
    return this.filmeRepository.buscarPorId(id);
  }

  atualizar(id, dados) {
    const existente = this.filmeRepository.buscarPorId(id);
    if (!existente) {
      return { sucesso: false, erros: ['Filme nao encontrado'] };
    }

    const erros = this.validar(dados);
    if (erros.length > 0) {
      return { sucesso: false, erros };
    }

    const filme = this.filmeRepository.atualizar(id, dados);
    return { sucesso: true, dados: filme };
  }

  excluir(id) {
    const existente = this.filmeRepository.buscarPorId(id);
    if (!existente) {
      return { sucesso: false, erros: ['Filme nao encontrado'] };
    }
    this.filmeRepository.excluir(id);
    return { sucesso: true };
  }

  obterEstatisticas() {
    return this.filmeRepository.obterEstatisticas();
  }
}

export { FilmeService };
