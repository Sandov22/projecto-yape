import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const initialOrderStates = ['CREATED', 'PROCESSING', 'SHIPPING', 'DELIVERED'];
        for(const stateName of initialOrderStates) {
            await prisma.state.create({
                data: {
                    state: stateName,
                    isOrder: 0
                }
            })
        }
        const initialProductStates = ['BLOCKED', 'INSTOCK', 'OUTOFSTOCK'];
        for(const stateName of initialProductStates) {
            await prisma.state.create({
                data: {
                state: stateName,
                isOrder: 1
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