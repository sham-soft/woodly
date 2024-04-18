import {
    Controller,
    Get,
    Query,
    Post,
    Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PurchasesService } from './purchases.service';
import { PurchaseQueryDto } from './dto/purchase.dto';
import { PurchaseCreateDto } from './dto/purchase-create.dto';
import { Purchase } from './schemas/purchase.schema';

@ApiTags('Purchases')
@Controller('purchases')
export class PurchasesController {
    constructor(private readonly purchasesService: PurchasesService) {}

    @ApiOperation({ summary: 'Получение списка выплат' })
    @Get()
    getPurchases(@Query() query: PurchaseQueryDto) {
        return this.purchasesService.getPurchases(query);
    }

    @ApiOperation({ summary: 'Создание выплаты' })
    @Post('create/')
    createCard(@Body() purchaseDto: PurchaseCreateDto): Promise<Purchase> {
        return this.purchasesService.createPurchase(purchaseDto);
    }
}