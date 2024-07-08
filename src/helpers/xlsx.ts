import { utils, write } from 'xlsx';

type ColumnType = {
    wch: number;
};

interface IXlsx {
    headers: string[];
    values: string[][];
    cols: ColumnType[];
}

export function createXlsx(params: IXlsx): Uint8Array {
    const ws = utils.aoa_to_sheet([params.headers, ...params.values]);
    ws['!cols'] = params.cols; 
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    return write(wb, { type: 'buffer', bookType: 'xlsx' });
}