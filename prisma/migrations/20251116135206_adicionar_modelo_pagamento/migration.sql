-- CreateTable
CREATE TABLE "Pagamento" (
    "id" SERIAL NOT NULL,
    "imovelId" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "dataPagamento" TIMESTAMP(3) NOT NULL,
    "dataVencimento" TIMESTAMP(3),
    "descricao" TEXT,
    "metodo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'recebido',
    "comprovante" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
