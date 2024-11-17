import { ArgumentMetadata, HttpStatus, ParseUUIDPipe } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export class CustomParseUUIDPipe extends ParseUUIDPipe {
    async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
        try{
            return await super.transform(value, metadata);
        }catch(error){
            throw new RpcException({ status: HttpStatus.PRECONDITION_FAILED, message: error.message })
        }
    }
}