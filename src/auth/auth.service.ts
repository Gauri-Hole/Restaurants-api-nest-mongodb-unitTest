import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signUp.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import ApiFeatures from '../utils/apiFeatures.utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    //resigter user
    async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {

        try {
            const { name, email, password } = signUpDto;
            const hashedpassword = await bcrypt.hash(password, 10);
            const user = await this.userModel.create({ name, email, password: hashedpassword });

            const token = await ApiFeatures.assignJwtToken(user._id, this.jwtService);
            return { token };
        } catch (error) {
            //handle duplicate key error
            if (error.code === 11000)
                throw new ConflictException('Duplicate email entered');
        }

    }
    //login user
    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email }).select('+password');
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
        //check if password is match or not
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const token = await ApiFeatures.assignJwtToken(user._id, this.jwtService);
        return { token };
    }
}
