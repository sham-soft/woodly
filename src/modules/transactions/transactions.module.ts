import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MakeTransactionService } from './services/make-transaction.service';
import { ExportTransactionService } from './services/export-transaction.service';
import { CreateTransactionService } from './services/create-transaction.service';
import { ActivateTransactionService } from './services/activate-transaction.service';
import { TransactionSchema } from './schemas/transaction.schema';
import { UsersModule } from '../users/users.module';
import { MessageSchema } from '../messages/schemas/message.schema';
import { CashboxSchema } from '../cashboxes/schemas/cashbox.schema';
import { CardSchema } from '../cards/schemas/card.schema';
import { AutopaymentSchema } from '../autopayments/schemas/autopayment.schema';

@Module({
    imports: [
        UsersModule,
        MongooseModule.forFeature([
            { name: 'cards', schema: CardSchema, collection: 'cards' },
            { name: 'autopayments', schema: AutopaymentSchema, collection: 'autopayments' },
            { name: 'messages', schema: MessageSchema, collection: 'messages' },
            { name: 'cashboxes', schema: CashboxSchema, collection: 'cashboxes' },
            { name: 'transactions', schema: TransactionSchema, collection: 'transactions' },
        ]),
    ],
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