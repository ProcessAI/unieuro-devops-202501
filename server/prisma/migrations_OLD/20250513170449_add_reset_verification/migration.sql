/*
  Warnings:

  - A unique constraint covering the columns `[tokenRedefinicao]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "tokenRedefinicao" TEXT,
ADD COLUMN     "tokenRedefinicaoExpira" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_tokenRedefinicao_key" ON "Cliente"("tokenRedefinicao");
