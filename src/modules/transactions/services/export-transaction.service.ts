import { utils, write } from 'xlsx';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { StreamableFile } from '@nestjs/common';
import { Transaction } from '../schemas/transaction.schema';
import { TransactionExportQueryDto } from '../dto/transaction-export.dto';
import { getQueryFilters, QueryFilterRules } from '../../../helpers/filters';

@Injectable()
export class ExportTransactionService {
    constructor(
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
    ) {}

    async getTransactionsExport(query: TransactionExportQueryDto): Promise<StreamableFile> {
        const filters = getQueryFilters(query, {
            dateStart: QueryFilterRules.CREATE_GT,
            dateEnd: QueryFilterRules.CREATE_LT,
            status: QueryFilterRules.EQUAL,
        });

        const transactions = await this.transactionModel.find(filters);
        
        const heaeders = ['ID сделки', 'Название', 'Номер карты', 'Сумма', 'Статус', 'Создан', 'Закрытие'];

        const values = transactions.map((item) => [
            item.transactionId,
            item.card.title,
            item.card.cardNumber,
            item.amount,
            item.status,
            item.dateCreate,
            item.dateClose,
        ]);

        const ws = utils.aoa_to_sheet([heaeders, ...values]);
        ws['!cols'] = [ { wch: 10 }, { wch: 25 }, { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 30 }, { wch: 30 } ]; 
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Data');
        const buf = write(wb, {type: 'buffer', bookType: 'xlsx' });

        return new StreamableFile(buf);
    }
}