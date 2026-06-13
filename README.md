# 🎬 CineManager

Sistema de gerenciamento de filmes para cinema desenvolvido como trabalho da disciplina **Programação de Computadores II (INF102)**.

O sistema permite o cadastro, consulta, edição e remoção de filmes através de uma interface web moderna e intuitiva, utilizando conceitos de **Orientação a Objetos**, persistência de dados com **SQLite** e arquitetura em camadas.

---

## 📚 Disciplina

**Programação de Computadores II (INF102)**

---

## 🎯 Objetivo do Projeto

Desenvolver uma aplicação web capaz de realizar operações de **CRUD (Create, Read, Update e Delete)** sobre um conjunto de filmes, aplicando conceitos fundamentais de **Programação Orientada a Objetos (POO)**, organização de código e persistência de dados.

---

## 🚀 Funcionalidades

* ✅ Cadastrar filmes
* ✅ Listar filmes cadastrados
* ✅ Editar informações de um filme
* ✅ Excluir filmes
* ✅ Buscar filmes por título
* ✅ Dashboard com estatísticas
* ✅ Interface responsiva
* ✅ Persistência dos dados em SQLite

---

## 🛠️ Tecnologias Utilizadas

### Backend

* Node.js
* Express
* SQLite (sql.js)

### Frontend

* HTML5
* CSS3
* JavaScript (ES6+)

### Banco de Dados

* SQLite

---

## 🏗️ Arquitetura do Projeto

```text
CineManager/
├── src/
│   ├── server.js
│   ├── database/
│   │   └── Database.js
│   ├── models/
│   │   └── Filme.js
│   ├── repositories/
│   │   └── FilmeRepository.js
│   ├── services/
│   │   └── FilmeService.js
│   └── routes/
│       └── filmeRoutes.js
│
├── public/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── app.js
│       └── api.js
│
└── data/
    └── cinema.db
```

---

## 🧩 Conceitos de Orientação a Objetos Aplicados

O projeto utiliza os principais conceitos de Orientação a Objetos exigidos pela disciplina.

### Classes e Objetos

O sistema foi estruturado utilizando classes para representar entidades e serviços:

* Filme
* DatabaseConnection
* FilmeRepository
* FilmeService
* FilmeRoutes
* Api
* App

---

### Encapsulamento

Os dados e comportamentos relacionados foram agrupados dentro de suas respectivas classes.

Exemplo:

* A classe `Filme` contém atributos como título, duração e status.
* A mesma classe possui métodos responsáveis por manipular seus próprios dados.
* O método `estaEmCartaz()` verifica se o filme está em exibição.
* O método `obterDuracaoFormatada()` converte internamente a duração em minutos para um formato mais amigável, como "2h 46min", sem que outras partes do sistema precisem conhecer essa lógica.

---

### Abstração

Cada classe expõe apenas o necessário e esconde detalhes internos de implementação.

Exemplos:

* `FilmeRepository` abstrai as consultas SQL.
* `DatabaseConnection` abstrai a comunicação com o SQLite.
* `FilmeService` abstrai as regras de validação.

---

### Composição

As classes trabalham juntas através de composição:

```text
DatabaseConnection
        ↓
FilmeRepository
        ↓
FilmeService
        ↓
FilmeRoutes
```

Cada camada utiliza a anterior para executar sua responsabilidade.

---

## 💾 Banco de Dados

O projeto utiliza SQLite para armazenamento dos dados.

Os registros são persistidos no arquivo:

```text
data/cinema.db
```

Tabela principal:

```sql
CREATE TABLE filmes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    genero TEXT NOT NULL,
    duracao INTEGER NOT NULL,
    classificacao TEXT NOT NULL,
    anoLancamento INTEGER NOT NULL,
    sinopse TEXT NOT NULL,
    status TEXT NOT NULL
);
```

---

## 🔄 Fluxo da Aplicação

```text
Usuário
   ↓
Frontend (App)
   ↓
API
   ↓
FilmeRoutes
   ↓
FilmeService
   ↓
FilmeRepository
   ↓
DatabaseConnection
   ↓
SQLite
```

---

## ⚙️ Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
```

### 2. Entrar na pasta do projeto

```bash
cd CineManager
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Executar a aplicação

```bash
npm start
```

### 5. Abrir no navegador

```text
http://localhost:3000
```

---

## 📖 Considerações Finais

O CineManager foi desenvolvido com o objetivo de aplicar os conceitos estudados na disciplina **Programação de Computadores II (INF102)**, demonstrando a utilização de Programação Orientada a Objetos, arquitetura em camadas, persistência de dados e desenvolvimento de aplicações web utilizando JavaScript.

O projeto busca unir simplicidade de implementação, organização de código e uma interface moderna para proporcionar uma experiência de uso agradável e intuitiva.

---

## 👨‍💻 Autor

Desenvolvido por **Alexander - 28041**  
Disciplina: **Programação de Computadores II (INF102)**  
Professor/Orientador do Trabalho: **Anderson Resende Lamas** 
Centro Universitário de Viçosa (Univiçosa)



