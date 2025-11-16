/*
  Warnings:

  - Made the column `templateId` on table `Contrato` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Contrato" DROP CONSTRAINT "Contrato_templateId_fkey";

-- AlterTable
ALTER TABLE "Contrato" ALTER COLUMN "templateId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ContratoTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
