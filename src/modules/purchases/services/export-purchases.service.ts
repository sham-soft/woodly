import { utils, write } from 'xlsx';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { StreamableFile } from '@nestjs/common';
import { Purchase } from '../schemas/purchase.schema';
import { PurchaseExportQueryDto } from '../dto/purchase-export.dto';
import { getFilters, FilterRules } from '../../../helpers/filters';

@Injectable()
export class ExportPurchasesService {
    constructor(
        @InjectModel('purchases') private purchaseModel: Model<Purchase>,
    ) {}

    async getPurchasesExport(query: PurchaseExportQueryDto): Promise<StreamableFile> {
        const filters = getFilters({
            dateCreate: {
                rule: FilterRules.GTE_LTE,
                value: { gte: query.dateStart, lte: query.dateEnd },
            },
        });

        if (query.cashboxIds) {
            filters['cashbox.cashboxId'] = { $in: [...query.cashboxIds] };
        }

        const purchases = await this.purchaseModel.find(filters);
        
        const heaeders = ['ID платежа', 'Способ выплаты', 'Карта', 'Сумма', 'Статус', 'Создан'];

        const values = purchases.map((item) => [
            item.purchaseId,
            item.paymentSystem,
            item.requisites,
            item.amount,
            item.status,
            item.dateCreate,
        ]);

        const ws = utils.aoa_to_sheet([heaeders, ...values]);
        ws['!cols'] = [ { wch: 10 }, { wch: 25 }, { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 30 }, { wch: 30 } ]; 
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Data');
        const buf = write(wb, {type: 'buffer', bookType: 'xlsx' });

        return new StreamableFile(buf);
    }
}