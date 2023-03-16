
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const token = 'jwtToken';

const mockAuthService = {
    signUp: jest.fn().mockResolvedValueOnce(token),
    login: jest.fn().mockResolvedValueOnce(token)
}
const signUpDto = {
    email: "gauri@gmail.com",
    name: "gauri",
    password: 'hashedPassword'
};


describe('RestaurantsController', () => {

    let controller: AuthController;
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService
                }
            ],
        }).compile();
        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService);
    })

    it('should be defined', () => {
        expect(controller).toBeDefined();
    })
    describe('signUp', () => {
        it('should signUp user', async () => {
            const result = await controller.signUp(signUpDto)
            expect(service.signUp).toHaveBeenCalled();
            expect(result).toEqual(token)
        })
    })

    describe('login', () => {
        it('should login user', async () => {
            const result = await controller.login(signUpDto)
            expect(service.login).toHaveBeenCalled();
            expect(result).toEqual(token)
        })
    })
})