/*
  Warnings:

  - You are about to drop the `StateOrderIntermediate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StateProductIntermediate` table. If the table is not empty, all the data it contains will be lost.
  - The required column `id` was added to the `OrderOldIntermediate` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `OrderProductsIntermediate` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `ProductCategoriesIntermediate` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "OrderOldIntermediate_orderID_key";

-- DropIndex
DROP INDEX "OrderProductsIntermediate_orderID_key";

-- DropIndex
DROP INDEX "ProductCategoriesIntermediate_productID_key";

-- AlterTable
ALTER TABLE "OrderOldIntermediate" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "OrderOldIntermediate_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "OrderProductsIntermediate" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "OrderProductsIntermediate_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProductCategoriesIntermediate" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ProductCategoriesIntermediate_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "StateOrderIntermediate";

-- DropTable
DROP TABLE "StateProductIntermediate";
