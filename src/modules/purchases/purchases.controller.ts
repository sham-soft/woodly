import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    Controller,
    Get,
    Query,
    Header,
    Post,
    Body,
    Patch,
    StreamableFile,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
} from '@nestjs/common';
import { Purchase } from './schemas/purchase.schema';
import { PurchasesService } from './purchases.service';
import { PurchaseQueryDto } from './dto/purchase.dto';
import { PurchaseUploadDto } from './dto/purchase-upload.dto';
import { PurchaseExportQueryDto } from './dto/purchase-export.dto';
import { PurchaseCreateDto } from './dto/purchase-create.dto';
import { PurchaseChangeStatusDto } from './dto/purchase-change-status.dto';
import { Public } from '../../decorators/public.decorator';
import type { PaginatedList } from '../../types/paginated-list.type';

@ApiTags('Purchases')
@Controller('purchases')
export class PurchasesController {
    constructor(private readonly purchasesService: PurchasesService) {}

    @ApiOperation({ summary: 'Получение списка выплат' })
    @Get()
    getPurchases(@Query() query: PurchaseQueryDto): Promise<PaginatedList<Purchase>> {
        return this.purchasesService.getPurchases(query);
    }

    @ApiOperation({ summary: 'Создание выплаты' })
    @Post('create/')
    createCard(@Body() purchaseDto: PurchaseCreateDto): Promise<Purchase> {
        return this.purchasesService.createPurchase(purchaseDto);
    }

    @ApiOperation({
        summary: 'Принять сделку. Отменить сделку. Подтвердить сделку',
        description: `
            - Чтобы принять сделку, нужно передать status = 2.
            - Чтобы отменить сделку, нужно передать status = 3.
            - Чтобы подтвердить сделку, нужно передать status = 4.
        `,
    })
    @Patch('change-status/')
    changeStatusCard(@Body() purchaseDto: PurchaseChangeStatusDto): Promise<Purchase> {
        return this.purchasesService.changeStatusCard(purchaseDto);
    }

    @ApiOperation({ summary: 'Получение списка выплат в формате Excel' })
    @Get('export/')
    @Header('Content-Disposition', 'attachment; filename="Purchases.xlsx"')
    getPurchasesExport(@Query() purchaseQuery: PurchaseExportQueryDto): Promise<StreamableFile> {
        return this.purchasesService.getPurchasesExport(purchaseQuery);
    }

    @ApiOperation({ summary: 'Прикрепление чека' })
    @Public() // TODO - убрать публичный доступ
    @ApiConsumes('multipart/form-data')
    @Post('upload/')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@Body() data: PurchaseUploadDto, @UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 1000000 }),
                new FileTypeValidator({ fileType: new RegExp('.jpeg|.png') }),
            ],
        }),
    ) file: Express.Multer.File): Promise<void> {
        return this.purchasesService.uploadFile(data.purchaseId, file);
    }
}