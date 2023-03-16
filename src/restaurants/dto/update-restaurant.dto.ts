import { isEmail, IsPhoneNumber, IsString, IsEmail, IsEnum, IsOptional, IsEmpty } from "class-validator"
import { User } from "../../auth/schemas/user.schema"
import { Category } from "../schemas/restaurants.schema"

export class UpdateRestaurantDto {
    @IsString()
    @IsOptional()
    readonly name: string

    @IsString()
    @IsOptional()
    readonly description: string

    @IsEmail({}, { message: 'Please enter correct email Id' })
    @IsOptional()
    readonly email: string

    @IsPhoneNumber('US')
    @IsOptional()
    readonly phoneNo: number

    @IsString()
    @IsOptional()
    readonly address: string

    @IsEnum(Category, { message: 'Please enter correct category' })
    @IsOptional()
    readonly category: Category

    @IsEmpty({ message: 'You can not provide the user Id' })
    readonly user: User
}