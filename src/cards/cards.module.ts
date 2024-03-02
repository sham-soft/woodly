import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardSchema } from './schemas/card.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'cards', schema: CardSchema, collection: 'cards' },
  ])],
  providers: [CardsService],
  controllers: [CardsController],
})
export class CardsModule {}