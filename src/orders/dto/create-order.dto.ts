import { Order, OrderStatus } from "@prisma/client";
import { IsEnum, IsNumber, isNumber, IsPositive } from 'class-validator';
import { OrderStatusList } from "../enum/order.enum";

export class CreateOrderDto {
    
    @IsNumber()
    @IsPositive()
    totalAmount: number;

    @IsNumber()
    @IsPositive()
    totalItems: number;

    @IsEnum(OrderStatusList, { message: `Posible status values are: ${OrderStatusList}`})
    status: OrderStatus = OrderStatus.PENDING;


}