import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum userRoles {
    ADMIN = 'admin',
    USER = 'user'
}

@Schema({
    timestamps: true
})
export class User extends Document {
    @Prop()
    name: string

    @Prop({ unique: [true, 'Duplicate email entered'] })
    email: string

    @Prop({ select: false })
    password: string

    @Prop({
        enum: userRoles,
        default: userRoles.USER
    })
    role: userRoles
}

export const UserSchema = SchemaFactory.createForClass(User)