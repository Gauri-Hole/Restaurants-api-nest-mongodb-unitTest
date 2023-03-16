import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { User, userRoles } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import ApiFeatures from '../utils/apiFeatures.utils';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

const mockAuthService = {
    create: jest.fn(),
    findOne: jest.fn(),
}

const mockUser = {
    _id: "64104f2c660401122caa0207",
    email: "gauri@gmail.com",
    name: "gauri",
    role: userRoles.USER,
    password: 'hashedPassword'
};

const token = 'jwtToken';

describe('AuthService', () => {
    let service: AuthService;
    let model: Model<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: 'jjhgsjdbsncbjdhcjd',
                    signOptions: { expiresIn: '1d' }
                })
            ],
            providers: [
                AuthService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockAuthService
                }
            ],
        }).compile();

        service = module.get<AuthService>(AuthService)
        model = module.get<Model<User>>(getModelToken(User.name))
    });


    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('signUp', () => {
        const signUpDto = {
            name: "gauri",
            email: "gauri@gmail.com",
            password: 'hashedPassword'
        };
        it('should register a new user', async () => {
            jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('testHash')
            jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve(mockUser))
            jest.spyOn(ApiFeatures, 'assignJwtToken').mockResolvedValueOnce(token)

            const result = await service.signUp(signUpDto)
            expect(bcrypt.hash).toHaveBeenCalled();
            expect(ApiFeatures.assignJwtToken).toHaveBeenCalled();
            expect(result.token).toEqual(token);
        })

        it('should throw duplicate email entered', async () => {
            jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.reject({ code: 11000 }))

            await expect(service.signUp(signUpDto)).rejects.toThrow(ConflictException)
        })
    })

    describe('login', () => {
        const loginDto = {
            email: "gauri@gmail.com",
            password: 'hashedPassword'
        }
        it('should login user', async () => {
            jest.spyOn(model, 'findOne').mockImplementationOnce(() => ({
                select: jest.fn().mockResolvedValueOnce(mockUser)
            } as any))
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
            jest.spyOn(ApiFeatures, 'assignJwtToken').mockResolvedValueOnce(token)
            const result = await service.login(loginDto);
            expect(result.token).toEqual(token)
        })
        it('should throw error as invalid email ', () => {
            jest.spyOn(model, 'findOne').mockImplementationOnce(() => ({
                select: jest.fn().mockResolvedValueOnce(null)
            } as any))
            expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
        })
        it('should throw error as invalid password', async () => {
            jest.spyOn(model, 'findOne').mockImplementationOnce(() => ({
                select: jest.fn().mockResolvedValueOnce(mockUser)
            } as any))
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);
            expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
        })
    })

});