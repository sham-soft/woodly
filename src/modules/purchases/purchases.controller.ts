import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    Controller,
    Get,
    Query,
    Header,
    Param,
    Post,
    Body,
    Patch,
    Request,
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
import { ROLES } from '../../helpers/constants';
import { RequireRoles } from '../../decorators/roles.decorator';
import { Public } from '../../decorators/public.decorator';
import type { PaginatedList } from '../../types/paginated-list.type';
import type { CustomRequest } from '../../types/custom-request.type';

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
    createCard(@Body() purchaseDto: PurchaseCreateDto, @Request() req: CustomRequest): Promise<Purchase> {
        return this.purchasesService.createPurchase(purchaseDto, req.user.userId);
    }

    @ApiOperation({ summary: 'Принять сделку' })
    @RequireRoles(ROLES.Trader)
    @Patch('activate/:id')
    activatePurchase(@Param('id') id: number, @Request() req: CustomRequest): Promise<void> {
        return this.purchasesService.activatePurchase(id, req.user.userId);
    }

    @ApiOperation({ summary: 'Подтвердить сделку' })
    @RequireRoles(ROLES.Admin, ROLES.Trader)
    @Patch('confirm/:id')
    confirmPurchase(@Param('id') id: number, @Request() req: CustomRequest): Promise<void> {
        return this.purchasesService.confirmPurchase(id, req.user.userId);
    }

    @ApiOperation({ summary: 'Отменить сделку' })
    @RequireRoles(ROLES.Admin, ROLES.Trader)
    @Patch('cancel/:id')
    cancelPurchase(@Param('id') id: number): Promise<void> {
        return this.purchasesService.cancelPurchase(id);
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