-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "asaasLinkId" TEXT,
ADD COLUMN     "descricaoError" TEXT,
ALTER COLUMN "dataEntrega" DROP NOT NULL,
ALTER COLUMN "notaFiscal" DROP NOT NULL,
ALTER COLUMN "dataDevolucao" DROP NOT NULL,
ALTER COLUMN "assinado" DROP NOT NULL;