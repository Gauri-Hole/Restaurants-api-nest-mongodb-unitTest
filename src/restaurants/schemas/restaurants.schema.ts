import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "../../auth/schemas/user.schema";

export enum Category {
    FAST_FOOD = 'fast food',
    CAFE = 'cafe',
    FINE_DINNING = 'fine dinning'
}

@Schema({
    timestamps: true
})
export class Restaurant {
    @Prop()
    name: string

    @Prop()
    description: string

    @Prop()
    email: string

    @Prop()
    phoneNo: number

    @Prop()
    address: string

    @Prop()
    category: Category

    @Prop()
    images?: object[]

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }])
    menu?: any[];

    // @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }])
    // menu?: Meal[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);