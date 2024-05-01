import {
    Controller,
    Get,
    Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReferencesService } from './references.service';
import { Reference } from './schemas/reference.schema';

@ApiTags('References')
@Controller('references')
export class ReferencesController {
    constructor(private readonly referencesService: ReferencesService) {}

    @ApiOperation({ summary: 'Получение всех справочников' })
    @Get()
    getAllReference(): Promise<Reference[]> {
        return this.referencesService.getAllReference();
    }

    @ApiOperation({
        summary: 'Получение справочника',
        description: `
            - Список статусов карт - card-statuses.
            - Список статусов продаж - transaction-statuses.
            - Список статусов для баланса - balance-statuses.
            - Список статусов покупок - purchase-statuses.
            - Список типов банков - bank-types.
            - Список способов оплаты - payment-systems.
        `,
    })
    @Get(':name')
    getReference(@Param('name') name: string): Promise<Reference> {
        return this.referencesService.getReference(name);
    }
}