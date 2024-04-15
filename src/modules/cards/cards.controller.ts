import {
    Controller,
    Get,
    Post,
    Param,
    Query,
    Body,
    Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { CardQueryDto } from './dto/card.dto';
import { CardCreateDto } from './dto/card-create.dto';
import { CardEditDto } from './dto/card-edit.dto';
import { CardSetLimitDto } from './dto/card-set-limit.dto';
import { CardChangeStatusDto } from './dto/card-change-status.dto';
import { CardTransactionsQueryDto } from './dto/card-transactions.dto';
import { Card } from './schemas/card.schema';

@ApiTags('Cards')
@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @ApiOperation({ summary: 'Получение списка карт' })
    @Get()
    getCards(@Query() cardQuery: CardQueryDto) {
        return this.cardsService.getCards(cardQuery);
    }
    
    @ApiOperation({ summary: 'Создание карты' })
    @Post('create/')
    createCard(@Body() cardDto: CardCreateDto): Promise<Card> {
        return this.cardsService.createCard(cardDto);
    }
    
    @ApiOperation({ summary: 'Редактирование карты' })
    @Patch('edit/')
    editCard(@Body() cardDto: CardEditDto): Promise<Card> {
        return this.cardsService.editCard(cardDto);
    }
    
    @ApiOperation({ summary: 'Установка лимитов' })
    @Patch('set-limit/')
    setLimitCard(@Body() cardDto: CardSetLimitDto): Promise<Card> {
        return this.cardsService.setLimitCard(cardDto);
    }

    @ApiOperation({
        summary: 'Активация карты. Отключение карты. Удаление карты. Восстановление карты',
        description: `
            - Чтобы активировать карту, нужно передать status = 1.
            - Чтобы отключить карту, нужно передать status = 2.
            - Чтобы удалить карту, нужно передать status = 3.
            - Чтобы восстановить карту, нужно передать status = 1.
        `,
    })
    @Patch('change-status/')
    changeStatusCard(@Body() cardDto: CardChangeStatusDto): Promise<Card> {
        return this.cardsService.changeStatusCard(cardDto);
    }

    @ApiOperation({ summary: 'Получение сделок по определенной карте' })
    @Get(':id/transactions/')
    getCardTransactions(@Param('id') id: number, @Query() cardQuery: CardTransactionsQueryDto) {
        return this.cardsService.getCardTransactions(id, cardQuery);
    }
}