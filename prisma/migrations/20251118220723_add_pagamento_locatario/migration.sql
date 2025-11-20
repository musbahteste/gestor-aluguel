-- AlterTable
ALTER TABLE "Pagamento" ADD COLUMN     "locatarioId" INTEGER;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "Locatario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
