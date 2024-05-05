import { IsString, IsNumberString } from 'class-validator';
import { ApiProperty} from '@nestjs/swagger';

export class PurchaseUploadDto {
    @ApiProperty()
    @IsString()
    comment?: string;

    @ApiProperty()
    @IsNumberString()
    purchaseId: number;

    @ApiProperty({ type: 'string', format: 'binary' })
    file: Express.Multer.File;
}