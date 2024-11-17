import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CustomParseUUIDPipe } from './pipes/CustomUUID.pipe';
import { ChangeOrderStatusDto, CreateOrderDto, OrderPaginationDto } from './dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern('findAllOrders')
  findAll(@Payload() payload: OrderPaginationDto) {
    return this.ordersService.findAll(payload);
  }

  @MessagePattern('findOneOrder')
  findOne(@Payload(CustomParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern('changeOrderStatus')
  changeOrderStatus(@Payload() orderStatusDto: ChangeOrderStatusDto) {
    return this.ordersService.changeOrderStatus(orderStatusDto);
  }
}
