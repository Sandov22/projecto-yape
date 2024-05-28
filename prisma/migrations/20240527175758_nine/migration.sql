/*
  Warnings:

  - Changed the type of `status` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('BLOCKED', 'INSTOCK', 'OUTOFSTOCK');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "status",
ADD COLUMN     "status" "ProductStatus" NOT NULL;

-- DropEnum
DROP TYPE "ProdStatus";
