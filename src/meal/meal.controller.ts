import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { CreateMealDto } from './dto/meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { MealService } from './meal.service';
import { Meal } from './schemas/meal.schema';

@Controller('meals')
export class MealController {
    constructor(private mealService: MealService) { }

    @Post()
    @UseGuards(AuthGuard())
    createmeal(
        @Body() createMealDto: CreateMealDto,
        @CurrentUser() user: User,
    ): Promise<Meal> {
        return this.mealService.createMeal(createMealDto, user)
    }

    @Get()
    getAllMeals(): Promise<Meal[]> {
        return this.mealService.findAll();
    }

    @Get('restaurant/:id')
    getMealsByRestautant(@Param('id') id: string): Promise<Meal[]> {
        return this.mealService.findAllMealsOfRestaurants(id);
    }

    @Get(':id')
    getMealById(@Param('id') id: string): Promise<Meal> {
        return this.mealService.findByid(id);
    }

    @UseGuards(AuthGuard())
    @Put(':id')
    async updateById(
        @Param('id') id: string,
        @Body() meal: UpdateMealDto,
        @CurrentUser() user: User
    ): Promise<Meal> {
        const res = await this.mealService.findByid(id);
        if (res.user.toString() !== user._id.toString()) {
            throw new ForbiddenException('You can not update this meal');
        }

        return this.mealService.updateById(id, meal);
    }

    @UseGuards(AuthGuard())
    @Delete(':id')
    async deleteById(
        @Param('id') id: string,
        @CurrentUser() user: User
    ): Promise<{ deleted: boolean }> {
        const res = await this.mealService.findByid(id);
        if (res.user.toString() !== user._id.toString()) {
            throw new ForbiddenException('You can not update this meal');
        }
        return this.mealService.deleteById(id);
    }
}
