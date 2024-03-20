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
import { TransactionQueryDto } from './dto/transaction.dto';
import { TransactionCreateDto } from './dto/transaction-create.dto';
import { TransactionEditDto } from './dto/transaction-edit.dto';
import { TransactionMakeDto } from './dto/transaction-make.dto';
import { TransactionExportQueryDto } from './dto/transaction-export.dto';
import { Transaction } from './schemas/transaction.schema';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Get()
    getTransactions(@Query() transactionQuery: TransactionQueryDto) {
        return this.transactionsService.getTransactions(transactionQuery);
    }

    @Post('create/')
    createTransaction(@Body() transactionDto: TransactionCreateDto): Promise<Transaction | string> {
        return this.transactionsService.createTransaction(transactionDto);
    }

    @Patch('edit/')
    editTransaction(@Body() transactionDto: TransactionEditDto): Promise<Transaction> {
        return this.transactionsService.editTransaction(transactionDto);
    }

    @Patch('make/')
    makeTransaction(@Body() transactionDto: TransactionMakeDto): Promise<string> {
        return this.transactionsService.makeTransaction(transactionDto);
    }

    @Get('confirm/:id')
    confirmTransaction(@Param('id') id: string): Promise<string> {
        return this.transactionsService.confirmTransaction(id);
    }

    @Get('export/')
    @Header('Content-Disposition', 'attachment; filename="Transactions.xlsx"')
    getTransactionsExport(@Query() transactionQuery: TransactionExportQueryDto): Promise<StreamableFile> {
        return this.transactionsService.getTransactionsExport(transactionQuery);
    }
}