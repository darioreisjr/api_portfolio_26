# 📁 API Portfolio 26

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey)

API RESTful desenvolvida com **NestJS** para gerenciar o conteúdo de um portfólio pessoal (projetos, tecnologias e categorias), com autenticação via Supabase Auth e upload de imagens via Supabase Storage.

🔗 **Deploy:** https://api-portfolio-26.vercel.app
📚 **Documentação (Swagger):** `/docs`

## ✨ Funcionalidades

- Autenticação via JWT (Supabase Auth)
- CRUD de projetos, com upload de imagem (JPEG, PNG, WebP)
- Paginação, filtros (categoria, destaque, busca por texto) e ordenação na listagem de projetos
- CRUD de categorias e tecnologias
- Endpoint de projetos em destaque
- Rate limiting (Throttler)
- Documentação interativa via Swagger
- Health check
- Segurança com Helmet, CORS configurável e compressão de respostas

## 🛠️ Tecnologias

- [NestJS](https://nestjs.com/) 11
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/) 7 (`@prisma/adapter-pg`)
- [PostgreSQL](https://www.postgresql.org/) (via Supabase)
- [Supabase](https://supabase.com/) (Auth + Storage)
- [Passport JWT](https://www.passportjs.org/)
- [Swagger / OpenAPI](https://swagger.io/)
- [class-validator](https://github.com/typestack/class-validator) / [class-transformer](https://github.com/typestack/class-transformer)
- [Multer](https://github.com/expressjs/multer) (upload de arquivos)
- [Helmet](https://helmetjs.github.io/), [Compression](https://github.com/expressjs/compression), [Throttler](https://docs.nestjs.com/security/rate-limiting)
- [Jest](https://jestjs.io/) (testes)
- Deploy serverless na [Vercel](https://vercel.com/)

## 📂 Estrutura do projeto

```
src/
├── auth/            # Login, guards, decorators e estratégia JWT
├── categories/       # CRUD de categorias
├── technologies/      # CRUD de tecnologias
├── projects/         # CRUD de projetos + upload de imagem + filtros
├── storage/          # Integração com Supabase Storage
├── health/           # Health check
├── common/           # DTOs, filtros e interceptors compartilhados
├── config/           # Configurações de ambiente
├── prisma/           # PrismaService/PrismaModule
├── app.module.ts
└── main.ts
prisma/
├── schema.prisma
└── migrations/
api/
└── index.ts          # Handler serverless para Vercel
```

## 🗃️ Modelo de dados

- **Category**: `id`, `name`, `slug`, `createdAt`
- **Technology**: `id`, `name`, `iconUrl`, `createdAt`
- **Project**: `id`, `title`, `description`, `imageUrl`, `projectUrl`, `repositoryUrl`, `isFeatured`, `categoryId`, `createdAt`, `updatedAt`
- **ProjectTechnology**: tabela de junção N:N entre `Project` e `Technology`

## ✅ Pré-requisitos

- Node.js 18+
- Conta e projeto no [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- npm

## ⚙️ Configuração

1. Clone o repositório e instale as dependências:

   ```bash
   git clone https://github.com/darioreisjr/api_portfolio_26.git
   cd api_portfolio_26
   npm install
   ```

2. Copie o arquivo de variáveis de ambiente e preencha com seus dados:

   ```bash
   cp .env.example .env
   ```

   | Variável | Descrição |
   |---|---|
   | `NODE_ENV` | Ambiente de execução (`development`/`production`) |
   | `PORT` | Porta da aplicação |
   | `API_PREFIX` | Prefixo global das rotas (ex: `api/v1`) |
   | `DATABASE_URL` | Connection string do PostgreSQL (pooler, porta 6543) |
   | `DIRECT_URL` | Connection string direta (porta 5432), usada nas migrations |
   | `SUPABASE_URL` | URL do projeto Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | Service role key do Supabase |
   | `SUPABASE_JWT_SECRET` | Secret usado para validar os JWTs do Supabase Auth |
   | `SUPABASE_STORAGE_BUCKET` | Nome do bucket usado para armazenar imagens |
   | `MAX_FILE_SIZE_BYTES` | Tamanho máximo de upload de imagem |
   | `CORS_ORIGINS` | Origens permitidas, separadas por vírgula |
   | `THROTTLE_TTL` / `THROTTLE_LIMIT` | Configuração de rate limiting |

3. Rode as migrations do Prisma:

   ```bash
   npm run prisma:migrate:dev
   ```

## ▶️ Executando o projeto

```bash
# desenvolvimento (watch mode)
npm run start:dev

# produção
npm run build
npm run start:prod
```

A API ficará disponível em `http://localhost:3000/api/v1` e a documentação Swagger em `http://localhost:3000/docs`.

## 🧪 Testes

```bash
npm run test        # testes unitários
npm run test:e2e     # testes end-to-end
npm run test:cov     # cobertura de testes
```

## 📖 Documentação da API

A documentação completa e interativa (Swagger) está disponível em `/docs` assim que o servidor está rodando, incluindo suporte a autenticação Bearer.

### Principais endpoints

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/auth/login` | Público | Login com email/senha (Supabase Auth) |
| GET | `/health` | Público | Status da API |
| GET | `/categories` | Público | Lista categorias |
| GET | `/categories/:id` | Público | Busca categoria por ID |
| POST | `/categories` | Autenticado | Cria categoria |
| PATCH | `/categories/:id` | Autenticado | Atualiza categoria |
| DELETE | `/categories/:id` | Autenticado | Remove categoria |
| GET | `/technologies` | Público | Lista tecnologias |
| GET | `/technologies/:id` | Público | Busca tecnologia por ID |
| POST | `/technologies` | Autenticado | Cria tecnologia |
| PATCH | `/technologies/:id` | Autenticado | Atualiza tecnologia |
| DELETE | `/technologies/:id` | Autenticado | Remove tecnologia |
| GET | `/projects` | Público | Lista projetos (paginado, filtros: `categoryId`, `isFeatured`, `search`, `page`, `limit`, `sortBy`, `order`) |
| GET | `/projects/featured` | Público | Lista projetos em destaque |
| GET | `/projects/:id` | Público | Busca projeto por ID |
| POST | `/projects` | Autenticado | Cria projeto (multipart, imagem opcional) |
| PATCH | `/projects/:id` | Autenticado | Atualiza projeto |
| DELETE | `/projects/:id` | Autenticado | Remove projeto |

> Rotas marcadas como "Autenticado" exigem um token JWT válido (`Authorization: Bearer <token>`), obtido via `/auth/login`.

## 🔒 Segurança

- Guard JWT global (`JwtAuthGuard`), com rotas públicas marcadas explicitamente via decorator `@Public()`
- Rate limiting global via `ThrottlerGuard`
- Cabeçalhos de segurança com `helmet`
- CORS configurável por variável de ambiente
- Validação e sanitização de payloads com `class-validator` (`whitelist`, `forbidNonWhitelisted`)

## 🚀 Deploy

O projeto está configurado para deploy serverless na Vercel (`vercel.json` + `api/index.ts`). O script `vercel-build` executa `prisma generate` automaticamente durante o build.

## 📝 Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run start:dev` | Inicia em modo desenvolvimento (watch) |
| `npm run start:prod` | Inicia em modo produção |
| `npm run build` | Gera o client do Prisma e compila o projeto |
| `npm run lint` | Executa o ESLint |
| `npm run format` | Formata o código com Prettier |
| `npm run prisma:migrate:dev` | Roda migrations em desenvolvimento |
| `npm run prisma:migrate:deploy` | Aplica migrations em produção |
| `npm run prisma:studio` | Abre o Prisma Studio |

## 👨‍💻 Autor

**Dario Reis**
GitHub: [@darioreisjr](https://github.com/darioreisjr)

## 📄 Licença

Este projeto está sob a licença UNLICENSED (uso privado/pessoal).
