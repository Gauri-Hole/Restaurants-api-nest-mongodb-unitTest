import { getModelToken } from "@nestjs/mongoose"
import { Test, TestingModule } from "@nestjs/testing"
import { JwtStrategy } from "./jwt.strategy"
import { User, userRoles } from "./schemas/user.schema"
import { Model } from 'mongoose';
import { UnauthorizedException } from "@nestjs/common";

const mockUser = {
    _id: "64104f2c660401122caa0207",
    email: "gauri@gmail.com",
    name: "gauri",
    role: userRoles.USER,
    password: 'hashedPassword'
};

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let model: Model<User>;
    beforeEach(async () => {
        process.env.JWT_SECRETE = 'jjhgsjdbsncbjdhcjd'
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        findById: jest.fn()
                    }
                }
            ],
        }).compile();
        jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
        model = module.get<Model<User>>(getModelToken(User.name))
    })
    afterEach(() => {
        delete process.env.JWT_SECRETE
    });

    it('should be define', () => {
        expect(jwtStrategy).toBeDefined();
    })

    describe('validate', () => {
        it('should validate the user', async () => {
            jest.spyOn(model, 'findById').mockResolvedValueOnce(mockUser as any)
            const result = await jwtStrategy.validate({ id: mockUser._id })
            expect(model.findById).toHaveBeenCalledWith(mockUser._id);
            expect(result).toEqual(mockUser)

        })
        it('should throw unauthorized exception', () => {
            jest.spyOn(model, 'findById').mockResolvedValueOnce(null)
            expect(jwtStrategy.validate(mockUser._id)).rejects.toThrow(UnauthorizedException)
        })
    })
})