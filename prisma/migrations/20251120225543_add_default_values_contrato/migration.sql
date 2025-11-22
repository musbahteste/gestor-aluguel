/*
  Warnings:

  - Added the required column `dataVencimento` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tempoContrato` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorReceber` to the `Contrato` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contrato" ADD COLUMN     "dataVencimento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tempoContrato" INTEGER NOT NULL DEFAULT 12,
ADD COLUMN     "valorReceber" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- CreateTable
CREATE TABLE "ContaReceber" (
    "id" SERIAL NOT NULL,
    "contratoId" INTEGER NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "dataRecebimento" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContaReceber_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContaReceber" ADD CONSTRAINT "ContaReceber_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
