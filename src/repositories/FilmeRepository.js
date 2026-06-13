class FilmeRepository {
  constructor(database) {
    this.db = database;
  }

  criar(filme) {
    const sql = [
      "INSERT INTO filmes (titulo, genero, duracao, classificacao, anoLancamento, sinopse, status)",
      "VALUES (?, ?, ?, ?, ?, ?, ?)"
    ].join(" ");
    this.db.execute(sql, [
      filme.titulo, filme.genero, filme.duracao,
      filme.classificacao, filme.anoLancamento, filme.sinopse, filme.status
    ]);
    const result = this.db.queryOne("SELECT last_insert_rowid() as id");
    return this.buscarPorId(result.id);
  }

  listar() {
    return this.db.query("SELECT * FROM filmes ORDER BY createdAt DESC");
  }

  buscarPorId(id) {
    return this.db.queryOne("SELECT * FROM filmes WHERE id = ?", [id]);
  }

  atualizar(id, dados) {
    const sql = [
      "UPDATE filmes",
      "SET titulo = ?,",
      "    genero = ?,",
      "    duracao = ?,",
      "    classificacao = ?,",
      "    anoLancamento = ?,",
      "    sinopse = ?,",
      "    status = ?,",
      "    updatedAt = datetime('now', 'localtime')",
      "WHERE id = ?"
    ].join("\n");
    this.db.execute(sql, [
      dados.titulo, dados.genero, dados.duracao,
      dados.classificacao, dados.anoLancamento, dados.sinopse,
      dados.status, id
    ]);
    return this.buscarPorId(id);
  }

  excluir(id) {
    this.db.execute("DELETE FROM filmes WHERE id = ?", [id]);
  }

  obterEstatisticas() {
    const total = this.db.queryOne("SELECT COUNT(*) as count FROM filmes");
    const emCartaz = this.db.queryOne("SELECT COUNT(*) as count FROM filmes WHERE status = 'Em Cartaz'");
    const emBreve = this.db.queryOne("SELECT COUNT(*) as count FROM filmes WHERE status = 'Em Breve'");
    const encerrado = this.db.queryOne("SELECT COUNT(*) as count FROM filmes WHERE status = 'Encerrado'");

    return {
      total: total.count,
      emCartaz: emCartaz.count,
      emBreve: emBreve.count,
      encerrado: encerrado.count
    };
  }
}

export { FilmeRepository };
