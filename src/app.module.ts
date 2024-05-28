import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { StateModule } from './state/state.module';

@Module({
  imports: [OrderModule, PrismaModule, ProductModule, CategoryModule, StateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
