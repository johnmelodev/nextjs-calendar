# Next.js Calendar API

API do aplicativo de calendário e agendamento para integração com o frontend em Next.js.

## Estrutura do Projeto

- `backend/`: API Node.js com Express e Prisma
- `frontend/`: Aplicativo Next.js (frontend)

## Deploy no Railway

Para fazer o deploy deste projeto no Railway, siga estas etapas:

1. Faça fork deste repositório para sua conta GitHub
2. No [dashboard do Railway](https://railway.app), clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Escolha o repositório que você acabou de criar
5. Configure as seguintes variáveis de ambiente:
   - `DATABASE_URL`: URL de conexão com o banco de dados PostgreSQL
   - `PORT`: 3333 (ou a porta desejada)
   - `NODE_ENV`: production
   - Opcionalmente, `RUN_SEED`: true (para executar o seed inicial do banco)

O deploy será feito automaticamente usando o Dockerfile personalizado.

## Solução de Problemas

Se você encontrar problemas com o build do Railway:

1. Verifique os logs de build para identificar o problema específico
2. Se houver erro de "dial tcp: lookup ghcr.io: i/o timeout", o problema está relacionado à indisponibilidade do GitHub Container Registry
3. A solução implementada neste projeto é usar um Dockerfile personalizado em vez de depender do nixpacks

## Desenvolvimento Local

```bash
# Instalar dependências
cd backend
npm install

# Configurar o banco de dados
npx prisma migrate dev

# Iniciar o servidor de desenvolvimento
npm run dev
```

## Documentação da API

A API oferece endpoints para:

- Categorias: `/categories`
- Serviços: `/services`
- Profissionais: `/professionals`
- Locais: `/locations`
- Pacientes: `/patients`
- Agendamentos: `/appointments`
