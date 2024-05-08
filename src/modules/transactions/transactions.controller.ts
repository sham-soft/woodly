import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Header,
    Param,
    Query,
    Post,
    Patch,
    Body,
} from '@nestjs/common';
import { StreamableFile } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './schemas/transaction.schema';
import { TransactionQueryDto } from './dto/transaction.dto';
import { TransactionMakeDto } from './dto/transaction-make.dto';
import { TransactionExportQueryDto } from './dto/transaction-export.dto';
import { TransactionEditDto } from './dto/transaction-edit.dto';
import { TransactionCreateDto } from './dto/transaction-create.dto';
import { Public } from '../../decorators/public.decorator';
import type { PaginatedList } from '../../types/paginated-list.type';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @ApiOperation({ summary: 'Получение списка сделок' })
    @Get()
    getTransactions(@Query() transactionQuery: TransactionQueryDto): Promise<PaginatedList<Transaction>> {
        return this.transactionsService.getTransactions(transactionQuery);
    }
    
    @ApiOperation({
        summary: 'Создание сделки и получение реквизитов оплаты (для лендинга)',
        description: 'bankType можно не передавать, если передано поле isSbp',
    })
    @Public()
    @Post('create/')
    createTransaction(@Body() transactionDto: TransactionCreateDto): Promise<Transaction | string> {
        return this.transactionsService.createTransaction(transactionDto);
    }

    @ApiOperation({
        summary: 'Подтверждение сделки чат-ботом (для чат-бота)',
        description: 'Отправление данных чат-ботом в сервис, после получения платежа на телефон',
    })
    @Public()
    @Patch('make/')
    makeTransaction(@Body() transactionDto: TransactionMakeDto): Promise<string> {
        return this.transactionsService.makeTransaction(transactionDto);
    }

    @ApiOperation({ summary: 'Проверка статуса сделки (для лендинга)' })
    @Public()
    @Get('check-status/:id')
    checkStatusTransaction(@Param('id') id: string): Promise<string> {
        return this.transactionsService.checkStatusTransaction(id);
    }

    @ApiOperation({ summary: 'Корректировка заявки' })
    @Patch('edit/')
    editTransaction(@Body() transactionDto: TransactionEditDto): Promise<Transaction> {
        return this.transactionsService.editTransaction(transactionDto);
    }

    @ApiOperation({ summary: 'Подтвердить сделку' })
    @Patch('confirm/:id')
    confirmTransaction(@Param('id') id: number): Promise<Transaction> {
        return this.transactionsService.confirmTransaction(id);
    }

    @ApiOperation({ summary: 'Отклонить сделку' })
    @Patch('cancel/:id')
    cancelTransaction(@Param('id') id: number): Promise<Transaction> {
        return this.transactionsService.cancelTransaction(id);
    }

    @ApiOperation({ summary: 'Получение списка сделок в формате Excel' })
    @Get('export/')
    @Header('Content-Disposition', 'attachment; filename="Transactions.xlsx"')
    getTransactionsExport(@Query() transactionQuery: TransactionExportQueryDto): Promise<StreamableFile> {
        return this.transactionsService.getTransactionsExport(transactionQuery);
    }
}