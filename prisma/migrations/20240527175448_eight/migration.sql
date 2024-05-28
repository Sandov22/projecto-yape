/*
  Warnings:

  - Changed the type of `status` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProdStatus" AS ENUM ('BLOCKED', 'INSTOCK', 'OUTOFSTOCK');

-- DropIndex
DROP INDEX "Product_name_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "status",
ADD COLUMN     "status" "ProdStatus" NOT NULL;

-- DropEnum
DROP TYPE "ProductStatus";
