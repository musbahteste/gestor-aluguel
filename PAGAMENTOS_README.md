# 📊 Sistema de Controle de Pagamentos

## Visão Geral

Sistema completo para gerenciar pagamentos de aluguel com dashboard de recebimentos, listagem de pagamentos e geração de relatórios.

## Funcionalidades

### 1. **Lançamento de Pagamentos** (`/pagamentos`)
- Formulário para registrar novos pagamentos
- Campos:
  - Imóvel (seleção)
  - Valor (em R$)
  - Data do Pagamento
  - Data de Vencimento (opcional)
  - Método (Dinheiro, Cheque, Transferência, PIX)
  - Status (Recebido, Pendente, Atrasado)
  - Descrição/Observações

### 2. **Listagem de Pagamentos** (`/pagamentos`)
- Visualização de todos os pagamentos registrados
- Filtros por:
  - Status (Todos, Recebido, Pendente, Atrasado)
  - Imóvel específico
- Colunas:
  - Imóvel
  - Locador
  - Valor
  - Data do Pagamento
  - Método de Pagamento
  - Status (com cores)
  - Ações (Deletar)

### 3. **Dashboard de Recebimentos** (`/pagamentos/dashboard`)
- Filtro por mês e ano
- Cartões de resumo com:
  - Total Recebido (verde)
  - Total Pendente (amarelo)
  - Total Atrasado (vermelho)
  - Total Geral
  - Quantidade de pagamentos
- Gráfico de pagamentos por método
- Tabela de recebimentos por imóvel

## Estrutura de Arquivos

```
app/
├── api/
│   └── pagamentos/
│       ├── route.ts                 # GET/POST pagamentos
│       ├── [id]/route.ts            # PUT/DELETE/GET por ID
│       └── dashboard/route.ts       # Dashboard API
├── components/
│   ├── PagamentoForm.tsx            # Formulário de lançamento
│   ├── PagamentoList.tsx            # Listagem de pagamentos
│   └── DashboardRecebimentos.tsx    # Dashboard visual
├── lib/
│   └── utils.ts                     # Funções utilitárias (formatação)
└── pagamentos/
    ├── page.tsx                     # Página principal
    └── dashboard/
        └── page.tsx                 # Página do dashboard
```

## Modelo de Dados (Prisma)

```prisma
model Pagamento {
  id               Int      @id @default(autoincrement())
  imovelId         Int
  imovel           Imovel   @relation(fields: [imovelId], references: [id])
  valor            Float
  dataPagamento    DateTime
  dataVencimento   DateTime?
  descricao        String?
  metodo           String   // "dinheiro", "cheque", "transferencia", "pix"
  status           String   @default("recebido") // "recebido", "pendente", "atrasado"
  comprovante      String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

## APIs Disponíveis

### GET `/api/pagamentos`
Buscar pagamentos com filtro opcional por imóvel
```
Query params:
- imovelId (opcional)
```

### POST `/api/pagamentos`
Criar novo pagamento
```json
{
  "imovelId": 1,
  "valor": 1500.00,
  "dataPagamento": "2025-11-16",
  "dataVencimento": "2025-11-10",
  "descricao": "Aluguel novembro",
  "metodo": "transferencia",
  "status": "recebido"
}
```

### GET `/api/pagamentos/[id]`
Buscar pagamento específico

### PUT `/api/pagamentos/[id]`
Atualizar pagamento

### DELETE `/api/pagamentos/[id]`
Deletar pagamento

### GET `/api/pagamentos/dashboard`
Dashboard com resumos e análises
```
Query params:
- mes (1-12)
- ano (YYYY)
```

## Instalação e Setup

1. **Aplicar migração do banco de dados:**
```bash
npm run prisma:migrate
```

2. **Gerar cliente Prisma:**
```bash
npm run prisma:generate
```

3. **Iniciar servidor de desenvolvimento:**
```bash
npm run dev
```

4. **Acessar a aplicação:**
- Pagamentos: http://localhost:3000/pagamentos
- Dashboard: http://localhost:3000/pagamentos/dashboard

## Navegação

O menu lateral foi atualizado com dois novos links:
- **Pagamentos**: Acesso ao formulário e listagem
- **Dashboard Recebimentos**: Visualização de relatórios e análises

## Recursos Implementados

✅ CRUD completo de pagamentos
✅ Filtros por status e imóvel
✅ Dashboard com múltiplas visualizações
✅ Integração com Prisma ORM
✅ API RESTful
✅ UI responsiva com Tailwind CSS
✅ Formatação de moeda (BRL)
✅ Códigos de cores por status
✅ Análise de pagamentos por método
✅ Resumo por imóvel e locador

## Próximas Melhorias Sugeridas

- [ ] Upload de comprovante de pagamento
- [ ] Envio de notificações para pagamentos pendentes
- [ ] Exportação de relatórios em PDF/Excel
- [ ] Gráficos mais avançados (Chart.js/Recharts)
- [ ] Reccurrência automática de pagamentos
- [ ] Integração com gateway de pagamento
- [ ] Auditoria de alterações
- [ ] Múltiplos usuários com permissões
