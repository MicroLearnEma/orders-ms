import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common/dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto';
import { ProductsMicroservice } from 'src/config';
import { catchError, firstValueFrom, map } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  constructor(@Inject(ProductsMicroservice.name) private readonly productsClient: ClientProxy) {
    super();
  }

  private readonly logger = new Logger(OrdersService.name);
  onModuleInit() {
    this.$connect();
    this.logger.debug('Connection to database succesfully')
  }
  async create(createOrderDto: CreateOrderDto) {
    const ids = createOrderDto.items.map(item => item.productId)
    const products = await firstValueFrom(this.productsClient.send<Array<any>>(ProductsMicroservice.Actions.VALIDATE, ids).pipe(
      catchError(e => { throw new RpcException(e) })
    ));

    const items = createOrderDto.items.map(item=> ({
      ...item,
      price: products.find(product => product.id === item.productId).price
    }));

    const totalAmount = items.reduce((acc, product) => acc + product.price  * product.quantity, 0)
    const totalItems = items.reduce( (acc, orderItem) => acc + orderItem.quantity, 0);

    const order = await this.order.create({
      data: {
        totalAmount,
        totalItems,
        OrderItem: {
          createMany: {
            data: items
          }
        }
      },
      include: {
        OrderItem: {
          select : {
            price: true,
            productId: true,
            quantity: true
          }
        }
      }
    })

    return {
      ...order,
      OrderItem: order.OrderItem.map((orderItem)=> ({
        ...orderItem,
        name: products.find(product => product.id === orderItem.productId ).name
      }))
    };
  }

  async findAll(paginationDto: OrderPaginationDto) {
    const totalPages = await this.order.count({
      where: {
        status: paginationDto.status
      }
    })

    const currentPage = paginationDto.page;
    const perPage = paginationDto.limit;
    return {
      data: await this.order.findMany({
        where: {
          status: paginationDto.status
        },
        skip: (currentPage - 1) * perPage,
        take: perPage
      }),
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage)
      }
    };
  }

  async findOne(id: string) {
    const order = await this.order.findUnique({
      where: { id },
      include: {
        OrderItem: {
          select: {
            productId: true,
            quantity: true,
            price: true
          }
        }
      }
    })
    if (!order) throw new RpcException({ status: HttpStatus.NOT_FOUND, message: `Order with id ${id} not found` });

    const orderItems = order.OrderItem.map(orderItem => (orderItem.productId));
    const products = await firstValueFrom(this.productsClient.send<Array<any>>(ProductsMicroservice.Actions.VALIDATE, orderItems))

    return {
      ...order,
      OrderItem: order.OrderItem.map( order => ({...order, name: products.find(product => order.productId === product.id).name}))
    };
  }

  async changeOrderStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;
    const order = await this.findOne(id);

    if (order.status == status) return order;

    return this.order.update({
      where: { id },
      data: { status }
    })
  }
}
