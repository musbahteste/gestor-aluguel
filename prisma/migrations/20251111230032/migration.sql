-- CreateTable
CREATE TABLE "Locador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Locador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locatario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Locatario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imovel" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "endereco" TEXT NOT NULL,
    "cidade" TEXT,
    "bairro" TEXT,
    "cep" TEXT,
    "valorAluguel" DOUBLE PRECISION NOT NULL,
    "area" DOUBLE PRECISION,
    "quartos" INTEGER,
    "banheiros" INTEGER,
    "garagem" BOOLEAN NOT NULL DEFAULT false,
    "locadorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Imovel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContratoTemplate" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContratoTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contrato" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER,
    "imovelId" INTEGER NOT NULL,
    "locadorId" INTEGER NOT NULL,
    "locatarioId" INTEGER NOT NULL,
    "conteudoGerado" TEXT NOT NULL,
    "dataGeracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Locador_cpf_key" ON "Locador"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Locatario_cpf_key" ON "Locatario"("cpf");

-- AddForeignKey
ALTER TABLE "Imovel" ADD CONSTRAINT "Imovel_locadorId_fkey" FOREIGN KEY ("locadorId") REFERENCES "Locador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ContratoTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_locadorId_fkey" FOREIGN KEY ("locadorId") REFERENCES "Locador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "Locatario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
