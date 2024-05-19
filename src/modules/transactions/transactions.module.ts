import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MakeTransactionService } from './services/make-transaction.service';
import { ExportTransactionService } from './services/export-transaction.service';
import { CreateTransactionService } from './services/create-transaction.service';
import { ActivateTransactionService } from './services/activate-transaction.service';
import { TransactionSchema } from './schemas/transaction.schema';
import { MessageSchema } from '../messages/schemas/message.schema';
import { ConfigSchema } from '../configs/schemas/config.schema';
import { CardSchema } from '../cards/schemas/card.schema';
import { AutopaymentSchema } from '../autopayments/schemas/autopayment.schema';

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
        ActivateTransactionService,
        MakeTransactionService,
        ExportTransactionService,
    ],
    controllers: [TransactionsController],
})
export class TransactionsModule {}