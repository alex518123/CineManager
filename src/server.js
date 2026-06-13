import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DatabaseConnection } from './database/Database.js';
import { FilmeRepository } from './repositories/FilmeRepository.js';
import { FilmeService } from './services/FilmeService.js';
import { FilmeRoutes } from './routes/filmeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const publicDir = join(__dirname, '..', 'public');
app.use(express.static(publicDir));

const database = new DatabaseConnection();
await database.conectar();

const filmeRepository = new FilmeRepository(database);
const filmeService = new FilmeService(filmeRepository);
const filmeRoutes = new FilmeRoutes(filmeService);

app.use('/api/filmes', filmeRoutes.getRouter());

app.get('*', (req, res) => {
  res.sendFile(join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log("CineManager rodando em http://localhost:" + PORT);
});
