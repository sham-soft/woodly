import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StreamableFile } from '@nestjs/common';
import { utils, write } from 'xlsx';
import { PurchaseExportQueryDto } from '../dto/purchase-export.dto';
import { Purchase } from '../schemas/purchase.schema';

@Injectable()
export class ExportPurchasesService {
    constructor(
        @InjectModel('purchases') private purchaseModel: Model<Purchase>,
    ) {}

    async getPurchasesExport(query: PurchaseExportQueryDto): Promise<StreamableFile> {
        const filters = {
            dateCreate: {
                $gt : query.dateStart,
                $lt : query.dateEnd,
            },
        };

        const purchases = await this.purchaseModel.find(filters);
        
        const heaeders = ['ID платежа', 'Способ выплаты', 'Карта', 'Сумма', 'Статус', 'Создан'];

        const values = purchases.map((item) => {
            return [
                item.purchaseId,
                item.paymentSystem,
                item.cardNumber,
                item.amount,
                item.status,
                item.dateCreate,
            ];
        });

        const ws = utils.aoa_to_sheet([heaeders, ...values]);
        ws['!cols'] = [ { wch: 10 }, { wch: 25 }, { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 30 }, { wch: 30 } ]; 
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Data');
        const buf = write(wb, {type: 'buffer', bookType: 'xlsx' });

        return new StreamableFile(buf);
    }
}