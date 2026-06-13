import { Router } from 'express';

class FilmeRoutes {
  constructor(filmeService) {
    this.router = Router();
    this.filmeService = filmeService;
    this.configurarRotas();
  }

  configurarRotas() {
    this.router.get('/', (req, res) => {
      const filmes = this.filmeService.listar();
      res.json(filmes);
    });

    this.router.get('/stats', (req, res) => {
      const stats = this.filmeService.obterEstatisticas();
      res.json(stats);
    });

    this.router.get('/:id', (req, res) => {
      const filme = this.filmeService.buscarPorId(Number(req.params.id));
      if (!filme) {
        return res.status(404).json({ erro: 'Filme nao encontrado' });
      }
      res.json(filme);
    });

    this.router.post('/', (req, res) => {
      const resultado = this.filmeService.criar(req.body);
      if (!resultado.sucesso) {
        return res.status(400).json({ erros: resultado.erros });
      }
      res.status(201).json(resultado.dados);
    });

    this.router.put('/:id', (req, res) => {
      const resultado = this.filmeService.atualizar(Number(req.params.id), req.body);
      if (!resultado.sucesso) {
        const status = resultado.erros[0] === 'Filme nao encontrado' ? 404 : 400;
        return res.status(status).json({ erros: resultado.erros });
      }
      res.json(resultado.dados);
    });

    this.router.delete('/:id', (req, res) => {
      const resultado = this.filmeService.excluir(Number(req.params.id));
      if (!resultado.sucesso) {
        return res.status(404).json({ erros: resultado.erros });
      }
      res.status(204).send();
    });
  }

  getRouter() {
    return this.router;
  }
}

export { FilmeRoutes };
