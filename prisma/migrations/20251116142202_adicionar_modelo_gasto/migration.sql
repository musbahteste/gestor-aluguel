-- CreateTable
CREATE TABLE "Gasto" (
    "id" SERIAL NOT NULL,
    "imovelId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT,
    "valor" DOUBLE PRECISION NOT NULL,
    "dataGasto" TIMESTAMP(3) NOT NULL,
    "arquivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gasto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Gasto" ADD CONSTRAINT "Gasto_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
