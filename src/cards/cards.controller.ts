import {
    Controller,
    Get,
    Post,
    Param,
    Query,
    Body,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardQueryDto } from './dto/card.dto';
import { CardCreateDto } from './dto/card-create.dto';
import { Card } from './schemas/card.schema';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @Get()
    getCards(@Query() cardQuery: CardQueryDto) {
        return this.cardsService.getCards(cardQuery);
    }

    @Get(':id')
    getCardId(@Param('id') id: string): Promise<Card> {
        return this.cardsService.getCardId(id);
    }

    @Post('create/')
    createCard(@Body() cardDto: CardCreateDto): Promise<Card | string> {
        return this.cardsService.createCard(cardDto);
    }
}