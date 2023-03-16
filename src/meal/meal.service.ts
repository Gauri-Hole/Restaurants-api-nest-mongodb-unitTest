import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { Restaurant } from '../restaurants/schemas/restaurants.schema';
import { Meal } from './schemas/meal.schema';

@Injectable()
export class MealService {
    constructor(
        @InjectModel(Meal.name)
        private mealModel: mongoose.Model<Meal>,
        @InjectModel(Restaurant.name)
        private restaurantModel: mongoose.Model<Restaurant>
    ) { }

    //create a new meal  Post  /meals

    async createMeal(meal: Meal, user: User): Promise<Meal> {
        const data = Object.assign(meal, { user: user._id });

        //saving meal ID into restaurant
        const restaurant = await this.restaurantModel.findById(meal.restaurant);

        if (!restaurant) {
            throw new NotFoundException('Restaurrant not found with this ID');
        }
        if (restaurant.user.toString() !== user._id.toString()) {
            throw new ForbiddenException('You can not add meal to this restaurant')
        }
        const MealCreated = await this.mealModel.create(data);
        restaurant.menu.push(MealCreated._id);
        await restaurant.save();
        return MealCreated;
    }

    //Get all meals    Get  /meals
    async findAll(): Promise<Meal[]> {
        const meals = await this.mealModel.find();
        return meals;
    }

    //Get all meals of restaurants  Get  /meals/reataurant/:id
    async findAllMealsOfRestaurants(id: string): Promise<Meal[]> {
        const meals = await this.mealModel.find({ restaurant: id })
        return meals;
    }

    //Get meal by id    Get   /meals/:id
    async findByid(id: string): Promise<Meal> {
        const isvalidId = mongoose.isValidObjectId(id);
        if (!isvalidId) {
            throw new BadRequestException('Wrong mongoose Id')
        }
        const meal = await this.mealModel.findById({ _id: id });
        if (!meal) {
            throw new NotFoundException('Meal not found');
        }
        return meal;
    }

    //update meal by id   Put  /meals/:id
    async updateById(id: string, meal): Promise<Meal> {
        const updatedMeal = await this.mealModel.findByIdAndUpdate(id, meal, { new: true, runValidators: true });
        if (!updatedMeal) {
            throw new NotFoundException('Meal not found');
        }
        return updatedMeal;
    }

    //delete meal by id   Delete  /meals/:id
    async deleteById(id: string): Promise<{ deleted: boolean }> {
        const meal = await this.mealModel.findByIdAndDelete({ _id: id });
        const restaurant = await this.restaurantModel.findById(meal.restaurant);

        if (!restaurant) {
            throw new NotFoundException('Restaurrant not found with this ID');
        }
        let arr = restaurant.menu;
        function arrayRemove(arr, id) {
            return arr.filter(function (geeks) {
                return geeks != id;
            });
        }
        restaurant.menu = arrayRemove(restaurant.menu, id);
        console.log("Remaining elements: " + restaurant.menu)
        await restaurant.save();
        if (meal) return { deleted: true }
        return { deleted: false }

    }

}
