import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Post,
    Param,
    Query,
    Body,
    Patch,
    Request,
} from '@nestjs/common';
import { Card } from './schemas/card.schema';
import { CardQueryDto } from './dto/card.dto';
import { CardTransactionsQueryDto } from './dto/card-transactions.dto';
import { CardSetLimitDto } from './dto/card-set-limit.dto';
import { CardEditDto } from './dto/card-edit.dto';
import { CardCreateDto } from './dto/card-create.dto';
import { CardsService } from './cards.service';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { ROLES } from '../../helpers/constants';
import { RequireRoles } from '../../decorators/roles.decorator';
import type { PaginatedList } from '../../types/paginated-list.type';
import type { CustomRequest } from '../../types/custom-request.type';

@ApiTags('Cards')
@RequireRoles(ROLES.Trader)
@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @ApiOperation({ summary: 'Получение списка карт' })
    @Get()
    getCards(@Query() cardQuery: CardQueryDto): Promise<PaginatedList<Card>> {
        return this.cardsService.getCards(cardQuery);
    }
    
    @ApiOperation({ summary: 'Создание карты' })
    @Post('create/')
    createCard(@Body() cardDto: CardCreateDto, @Request() req: CustomRequest): Promise<Card> {
        return this.cardsService.createCard(cardDto, req.user.userId);
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

    @ApiOperation({ summary: 'Активация карты' })
    @Patch('activate/:id')
    activateCard(@Param('id') id: number): Promise<void> {
        return this.cardsService.activateCard(id);
    }

    @ApiOperation({ summary: 'Отключение карты' })
    @Patch('disable/:id')
    disableCard(@Param('id') id: number): Promise<void> {
        return this.cardsService.disableCard(id);
    }

    @ApiOperation({ summary: 'Удаление карты' })
    @Patch('delete/:id')
    deleteCard(@Param('id') id: number): Promise<void> {
        return this.cardsService.deleteCard(id);
    }

    @ApiOperation({ summary: 'Получение сделок по определенной карте' })
    @Get(':id/transactions/')
    getCardTransactions(@Param('id') id: number, @Query() cardQuery: CardTransactionsQueryDto): Promise<PaginatedList<Transaction>> {
        return this.cardsService.getCardTransactions(id, cardQuery);
    }
}