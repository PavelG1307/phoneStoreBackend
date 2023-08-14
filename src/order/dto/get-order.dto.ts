import { IsEnum, IsOptional } from "class-validator"

type orderBy = 'fullName' |  'phoneNumber' | 'communicationMethod' |
  'delivery' |  'status' |  'createdAt' |  'updatedAt' |
  'paymentTypeId' |  'email' |  'payerTypeId'

type order = 'DESC' | 'ASC'

export class GetOrderDto {
  
    @IsOptional()
    limit?: string
  
    @IsOptional()
    offset?: string
  
    @IsOptional()
    @IsEnum(['fullName', 'phoneNumber', 'communicationMethod',
    'delivery', 'status', 'createdAt', 'updatedAt',
    'paymentTypeId', 'email', 'payerTypeId'])

    orderBy?: orderBy
  
    @IsOptional()
    @IsEnum(['DESC', 'ASC'])
    order?: order
  }
  