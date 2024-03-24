import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigSchema } from '../configs/schemas/config.schema';
import { CardSchema } from '../cards/schemas/card.schema';
import { AutopaymentSchema } from '../autopayments/schemas/autopayment.schema';
import { MessageSchema } from '../messages/schemas/message.schema';
import { TransactionSchema } from './schemas/transaction.schema';
import { TransactionsService } from './transactions.service';
import { MakeTransactionService } from './services/make-transaction.service';
import { CreateTransactionService } from './services/create-transaction.service';
import { ExportTransactionService } from './services/export-transaction.service';
import { TransactionsController } from './transactions.controller';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'configs', schema: ConfigSchema, collection: 'configs' },
        { name: 'cards', schema: CardSchema, collection: 'cards' },
        { name: 'autopayments', schema: AutopaymentSchema, collection: 'autopayments' },
        { name: 'messages', schema: MessageSchema, collection: 'messages' },
        { name: 'transactions', schema: TransactionSchema, collection: 'transactions' },
    ])],
    providers: [
        TransactionsService,
        CreateTransactionService,
        MakeTransactionService,
        ExportTransactionService,
    ],
    controllers: [TransactionsController],
})
export class TransactionsModule {}