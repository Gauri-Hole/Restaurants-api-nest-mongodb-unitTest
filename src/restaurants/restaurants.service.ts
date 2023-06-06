import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Restaurant } from './schemas/restaurants.schema';
import { Query } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class RestaurantsService {
    constructor(
        @InjectModel(Restaurant.name)
        private restaurantModel: mongoose.Model<Restaurant>
    ) { }

    //Get all restaurants    GET  /restaurants
    async findAll(query: Query): Promise<Restaurant[]> {
        const resPerPage = 10;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        const keyword = query.keyword ? {
            name: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {}
        const restaurants = await this.restaurantModel
            .find({ ...keyword })
            .limit(resPerPage)
            .skip(skip);
        return restaurants;
    }

    //Get all restaurants with exec()
    async findRES(query: Query): Promise<Restaurant[]> {
        const resPerPage = 10;
        let sort: any = { $name: -1 };
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        const keyword = query.keyword ? {
            name: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {}
        const restaurants = await this.restaurantModel
            .find({ ...keyword }).sort(sort).limit(resPerPage).skip(skip).exec();
        return restaurants;
    }

    //Create new restaurant   POST  /restaurants
    async create(restaurant: Restaurant, user: User): Promise<Restaurant> {
        const data = Object.assign(restaurant, { user: user._id })
        const res = await this.restaurantModel.create(data);
        return res;
    }

    //Get restaurant by Id  GET  /restaurants/:id
    async findById(id: string): Promise<Restaurant> {
        const isValidId = mongoose.isValidObjectId(id);
        if (!isValidId) {
            throw new BadRequestException('Invalid mongoose Id, please enter correct Id');
        }
        const restaurant = await this.restaurantModel.findById(id);

        if (!restaurant) {
            throw new NotFoundException('Restaurant not found');
        }
        return restaurant;
    }

    //Update restaurant by Id   PUT  /restaurants/:id
    async updateById(id: string, restaurant): Promise<Restaurant> {
        const res = await this.restaurantModel.findByIdAndUpdate(id, restaurant, { new: true, runValidators: true });
        if (!res) {
            throw new NotFoundException('Restaurant not found');
        }
        return res;
    }

    //delete restaurant by Id    DELETE   /restaurants/:id
    async deleteById(id: string): Promise<Restaurant> {
        const res = await this.restaurantModel.findByIdAndDelete(id);
        return res;
    }
}
