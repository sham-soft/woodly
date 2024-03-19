import {
    Controller,
    Get,
    Post,
    Param,
    Query,
    Body,
    Patch,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardQueryDto } from './dto/card.dto';
import { CardCreateDto } from './dto/card-create.dto';
import { CardEditDto } from './dto/card-edit.dto';
import { CardSetLimitDto } from './dto/card-set-limit.dto';
import { CardChangeStatusDto } from './dto/card-change-status.dto';
import { CardTransactionsQueryDto } from './dto/card-transactions.dto';
import { Card } from './schemas/card.schema';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @Get()
    getCards(@Query() cardQuery: CardQueryDto) {
        return this.cardsService.getCards(cardQuery);
    }
    
    @Post('create/')
    createCard(@Body() cardDto: CardCreateDto): Promise<Card> {
        return this.cardsService.createCard(cardDto);
    }
    
    @Patch('edit/')
    editCard(@Body() cardDto: CardEditDto): Promise<Card> {
        return this.cardsService.editCard(cardDto);
    }
    
    @Patch('set-limit/')
    setLimitCard(@Body() cardDto: CardSetLimitDto): Promise<Card> {
        return this.cardsService.setLimitCard(cardDto);
    }

    @Patch('change-status/')
    changeStatusCard(@Body() cardDto: CardChangeStatusDto): Promise<Card> {
        return this.cardsService.changeStatusCard(cardDto);
    }

    @Get(':id/transactions/')
    getCardTransactions(@Param('id') id: number, @Query() cardQuery: CardTransactionsQueryDto) {
        return this.cardsService.getCardTransactions(id, cardQuery);
    }
}