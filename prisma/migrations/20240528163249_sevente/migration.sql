/*
  Warnings:

  - You are about to drop the column `status` on the `Product` table. All the data in the column will be lost.
  - Added the required column `statusID` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "status",
ADD COLUMN     "statusID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_statusID_fkey" FOREIGN KEY ("statusID") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
