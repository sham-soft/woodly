import {
    Controller,
    Get,
    Param,
    Query,
    Post,
    Body,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionQueryDto } from './dto/transaction.dto';
import { TransactionCreateDto } from './dto/transaction-create.dto';
// import { TransactionMakeDto } from './dto/transaction-make.dto';
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

    // @Post('make/')
    // makeTransaction(@Body() paymentDto: TransactionMakeDto): Promise<string> {
    //     return this.transactionsService.makeTransaction(paymentDto);
    // }

    @Get('confirm/:id')
    confirmTransaction(@Param('id') id: string): Promise<string> {
        return this.transactionsService.confirmTransaction(id);
    }
}