import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator"
import { User } from "../../auth/schemas/user.schema"
import { Category } from "../schemas/restaurants.schema"

export class CreateRestaurantDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsNotEmpty()
    @IsString()
    readonly description: string

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email Id' })
    readonly email: string

    @IsPhoneNumber('US')
    readonly phoneNo: number

    @IsNotEmpty()
    @IsString()
    readonly address: string

    @IsNotEmpty()
    @IsEnum(Category, { message: 'Please enter correct category' })
    readonly category: Category

    @IsEmpty({ message: 'You can not provide the user Id' })
    readonly user: User
}