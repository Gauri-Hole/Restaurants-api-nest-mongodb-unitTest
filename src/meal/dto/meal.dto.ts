import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { User } from "../../auth/schemas/user.schema"
import { Category } from "../schemas/meal.schema"

export class CreateMealDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsNotEmpty()
    @IsString()
    readonly description: string

    @IsNotEmpty()
    @IsNumber()
    readonly price: number

    @IsNotEmpty()
    @IsEnum(Category, { message: 'Please enter correct category for this meal' })
    readonly category: Category

    @IsNotEmpty()
    @IsString()
    readonly restaurant: string

    @IsEmpty({ message: 'You can not provide a user Id' })
    readonly user: User
}