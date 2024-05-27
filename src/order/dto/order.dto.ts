import { Product } from "@prisma/client"

export class OrderDto {
    products: string
    description: string
}