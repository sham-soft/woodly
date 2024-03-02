// import {
//     Controller,
//     Get,
//     Post,
//     Body,
// } from '@nestjs/common';
// import { TransactionsService } from './transactions.service';
// import { TransactionCreateDto } from './dto/transaction-create.dto';
// import { TransactionMakeDto } from './dto/transaction-make.dto';
// import { TransactionConfirmDto } from './dto/transaction-confirm.dto';
// import { Transaction } from './schemas/transaction.schema';
// import { Payment } from '../payments/schemas/payment.schema';

// @Controller('transactions')
// export class TransactionsController {
//     constructor(private readonly transactionsService: TransactionsService) {}

//     @Get()
//     getTransactions(): Promise<Transaction[]> {
//         return this.transactionsService.getTransactions();
//     }

//     @Post('create/')
//     createTransaction(@Body() paymentDto: TransactionCreateDto): Promise<Payment | string> {
//         return this.transactionsService.createTransaction(paymentDto);
//     }

//     @Post('make/')
//     makeTransaction(@Body() paymentDto: TransactionMakeDto): Promise<string> {
//         return this.transactionsService.makeTransaction(paymentDto);
//     }

//     @Post('confirm/')
//     confirmTransaction(@Body() paymentDto: TransactionConfirmDto): Promise<string> {
//         return this.transactionsService.confirmTransaction(paymentDto);
//     }
// }