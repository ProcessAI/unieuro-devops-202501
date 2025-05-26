/*
  Warnings:

  - A unique constraint covering the columns `[tokenVerificacao]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "tokenExpiracao" TIMESTAMP(3),
ADD COLUMN     "tokenVerificacao" TEXT,
ADD COLUMN     "verificado" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_tokenVerificacao_key" ON "Cliente"("tokenVerificacao");
