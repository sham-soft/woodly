import {
    Controller,
    Get,
    Post,
    Param,
    Body,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentCreateDto } from './dto/payment-create.dto';
import { PaymentMakeDto } from './dto/payment-make.dto';
import { PaymentConfirmDto } from './dto/payment-confirm.dto';
import { Payment } from './schemas/payment.schema';
import { Transaction } from './schemas/transaction.schema';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Get()
    getPayments(): Promise<Payment[]> {
        return this.paymentsService.getPayments();
    }

    @Get('transactions/')
    getTransactions(): Promise<Transaction[]> {
        return this.paymentsService.getTransactions();
    }

    @Get(':id')
    getPaymentId(@Param('id') id: string): Promise<Payment> {
        return this.paymentsService.getPaymentId(id);
    }

    @Post('create/')
    createOperation(@Body() paymentDto: PaymentCreateDto): Promise<Payment | string> {
        return this.paymentsService.createOperation(paymentDto);
    }

    @Post('make/')
    makePayment(@Body() paymentDto: PaymentMakeDto): Promise<string> {
        return this.paymentsService.makePayment(paymentDto);
    }

    @Post('confirm/')
    confirmPayment(@Body() paymentDto: PaymentConfirmDto): string {
        return this.paymentsService.confirmPayment(paymentDto);
    }
}