# fly.toml
# Nome do seu aplicativo no Fly.io. Deve ser o mesmo do seu comando 'flyctl deploy -a'
app = "gestor-aluguel"

# Região primária para deploy. 'gru' é São Paulo, Brasil.
primary_region = "gru"

# Esta seção informa ao Fly para usar seu Dockerfile local para construir a imagem.
[build]
  # Como seu arquivo se chama 'Dockerfile', o Fly.io o encontrará automaticamente.
  # Você não precisa especificar 'dockerfile = "Dockerfile"' aqui, a menos que tenha um nome diferente.

# ESTA É A PARTE MAIS IMPORTANTE PARA O PRISMA
# O 'release_command' é executado uma vez, após o build ser bem-sucedido,
# mas antes da nova versão ser lançada. É o local perfeito
# para executar as migrações do seu banco de dados.
[deploy]
  release_command = "npx prisma migrate deploy"

# Variáveis de ambiente que seu app precisa.
# NÃO coloque sua DATABASE_URL aqui! Use 'flyctl secrets set' (veja abaixo).
[env]
  PORT = "3000"
  NODE_ENV = "production"
  HOSTNAME = "0.0.0.0" # Garante que o Next.js aceite conexões externas

# Esta seção informa ao Fly como rotear o tráfego para seu app
[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true  # Para automaticamente para economizar (em planos gratuitos)
  auto_start_machines = true # Inicia automaticamente quando recebe tráfego
  min_machines_running = 0   # Defina como 1 (ou mais) para produção "sempre ativa"

  [http_service.concurrency]
    type = "connections"
    soft_limit = 20
    hard_limit = 25

# Verificação de saúde para garantir que seu app está rodando antes de
# direcionar tráfego para ele.
[[services.checks]]
  type = "tcp"
  port = 3000
  interval = "15s"
  timeout = "2s"