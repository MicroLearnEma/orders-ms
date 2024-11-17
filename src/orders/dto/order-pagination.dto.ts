import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus } from "@prisma/client";
import { OrderStatusList } from "../enum/order.enum";
import { PaginationDto } from "src/common/dto";

export class OrderPaginationDto extends PaginationDto   {
    @IsOptional()
    @IsEnum(OrderStatusList, {
        message : `status must be one of the following values: ${OrderStatusList}`
    })
    status: OrderStatus;
}