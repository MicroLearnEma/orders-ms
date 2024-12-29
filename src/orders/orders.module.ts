import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { env, ProductsMicroservice } from 'src/config';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    ClientsModule.register([
      { 
        name: ProductsMicroservice.name, 
        transport: Transport.NATS, 
        options: {
          servers: env.nats_servers
        }
      }
    ])
  ]
})
export class OrdersModule {}
