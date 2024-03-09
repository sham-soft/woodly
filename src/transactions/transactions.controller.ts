import {
    Controller,
    Get,
    Param,
    Query,
    Post,
    Patch,
    Body,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionQueryDto } from './dto/transaction.dto';
import { TransactionCreateDto } from './dto/transaction-create.dto';
import { TransactionMakeDto } from './dto/transaction-make.dto';
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

    @Patch('make/')
    makeTransaction(@Body() transactionDto: TransactionMakeDto): Promise<string> {
        return this.transactionsService.makeTransaction(transactionDto);
    }

    @Get('confirm/:id')
    confirmTransaction(@Param('id') id: string): Promise<string> {
        return this.transactionsService.confirmTransaction(id);
    }
}