import initSqlJs from 'sql.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class DatabaseConnection {
  constructor() {
    this.dbPath = join(__dirname, '..', '..', 'data', 'cinema.db');
    this.db = null;
  }

  async conectar() {
    const SQL = await initSqlJs();

    let buffer = null;
    try {
      buffer = fs.readFileSync(this.dbPath);
    } catch {
      // Arquivo ainda nao existe
    }

    this.db = new SQL.Database(buffer);
    this.iniciarTabelas();
    this.persistir();
  }

  iniciarTabelas() {
    const sql = [
      "CREATE TABLE IF NOT EXISTS filmes (",
      "  id INTEGER PRIMARY KEY AUTOINCREMENT,",
      "  titulo TEXT NOT NULL,",
      "  genero TEXT NOT NULL,",
      "  duracao INTEGER NOT NULL,",
      "  classificacao TEXT NOT NULL,",
      "  anoLancamento INTEGER NOT NULL,",
      "  sinopse TEXT NOT NULL,",
      "  status TEXT NOT NULL DEFAULT 'Em Breve',",
      "  poster TEXT,",
      "  createdAt TEXT DEFAULT (datetime('now', 'localtime')),",
      "  updatedAt TEXT DEFAULT (datetime('now', 'localtime'))",
      ")"
    ].join("\n");
    this.db.run(sql);
    try {
      this.db.run("ALTER TABLE filmes ADD COLUMN poster TEXT");
    } catch {
      // Coluna ja existe
    }
  }

  persistir() {
    const data = this.db.export();
    fs.writeFileSync(this.dbPath, Buffer.from(data));
  }

  query(sql, params = []) {
    const stmt = this.db.prepare(sql);
    if (params.length > 0) stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
  }

  queryOne(sql, params = []) {
    const rows = this.query(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }

  execute(sql, params = []) {
    this.db.run(sql, params);
    this.persistir();
  }
}

export { DatabaseConnection };
