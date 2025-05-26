/*
  Warnings:

  - Added the required column `precoOriginal` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "precoOriginal" DECIMAL(65,30) NOT NULL;
