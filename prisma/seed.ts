import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const initialOrderStates = ['CREATED', 'PROCESSING', 'SHIPPING', 'DELIVERED'];
        for(const stateName of initialOrderStates) {
            await prisma.orderState.create({
                data: {
                    state: stateName.toLowerCase(),
                }
            })
        }
        const initialProductStates = ['BLOCKED', 'INSTOCK', 'OUTOFSTOCK'];
        for(const stateName of initialProductStates) {
            await prisma.productState.create({
                data: {
                state: stateName.toLowerCase(),
                }
            })
        }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });