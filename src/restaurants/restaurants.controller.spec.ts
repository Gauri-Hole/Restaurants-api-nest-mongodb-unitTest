import { ForbiddenException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { userRoles } from '../auth/schemas/user.schema';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

const mockRestaurant = {
    _id: "64105831cced1e972fab241b",
    name: "Retaurant 3",
    description: "This is just a description",
    email: "gauri@gamil.com",
    phoneNo: 9788246116,
    address: "200 Olympic Dr, Stafford, VS, 22554",
    category: "fast food",
    images: [],
    user: "64104f2c660401122caa0207",
    menu: [],
    updatedAt: "2023-03-15T06:44:37.099Z"
}

const mockUser = {
    _id: "64104f2c660401122caa0207",
    email: "gauri@gmail.com",
    name: "gauri",
    role: userRoles.USER,
}

let mockRestaurantService = {
    findAll: jest.fn().mockResolvedValueOnce([mockRestaurant]),
    create: jest.fn(),
    findById: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn()
}

describe('RestaurantsController', () => {

    let controller: RestaurantsController;
    let service: RestaurantsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
            controllers: [RestaurantsController],
            providers: [
                {
                    provide: RestaurantsService,
                    useValue: mockRestaurantService
                }
            ],
        }).compile();
        controller = module.get<RestaurantsController>(RestaurantsController);
        service = module.get<RestaurantsService>(RestaurantsService);
    })

    it('should be defined', () => {
        expect(controller).toBeDefined();
    })

    describe('findAll', () => {
        it('should find all restaurants', async () => {
            const result = await controller.getAllRestaurants({ keyword: 'restaurant' })
            expect(service.findAll).toHaveBeenCalled()
            expect(result).toEqual([mockRestaurant])
        })
    })

    describe('create', () => {
        it('should create the restaurant', async () => {
            const newRestaurant = {
                name: "Retaurant 3",
                description: "This is just a description",
                email: "gauri@gamil.com",
                phoneNo: 9788246116,
                address: "200 Olympic Dr, Stafford, VS, 22554",
                category: "fast food",
            }
            mockRestaurantService.create = jest.fn().mockResolvedValueOnce(mockRestaurant);
            const result = await controller.createRestaurant(newRestaurant as any, mockUser as any)
            expect(service.create).toHaveBeenCalled()
            expect(result).toEqual(mockRestaurant);
        })
    })

    describe('getRestaurantById', () => {
        it('should get the restaurant by Id', async () => {
            mockRestaurantService.findById = jest.fn().mockResolvedValueOnce(mockRestaurant);
            const result = await controller.getRestaurant(mockRestaurant._id)
            expect(service.findById).toHaveBeenCalled()
            expect(result).toEqual(mockRestaurant)
        })
    })

    describe('updateRestaurantById', () => {
        const restaurant = { ...mockRestaurant, name: 'updated' }
        const newRestaurant = {
            name: "updated"
        }
        it('should update restaurant by id', async () => {

            mockRestaurantService.findById = jest.fn().mockResolvedValueOnce(mockRestaurant);
            mockRestaurantService.updateById = jest.fn().mockResolvedValueOnce(restaurant)
            const result = await controller.updateRestaurant(mockRestaurant._id, newRestaurant as any, mockUser as any)

            expect(service.updateById).toHaveBeenCalled()
            expect(result.name).toEqual(newRestaurant.name)
        })

        it('should not update this restaurant', async () => {
            mockRestaurantService.findById = jest.fn().mockResolvedValueOnce(mockRestaurant);
            const user = {
                ...mockUser,
                _id: '64104f2c660401122caa0206'
            }
            await expect(controller.updateRestaurant(mockRestaurant._id, newRestaurant as any, user as any))
                .rejects.toThrow(ForbiddenException)

        })
    })

    describe('deleteById', () => {
        it('should delete restaurant by Id', async () => {
            const deleteMessage = { deleted: true }
            mockRestaurantService.findById = jest.fn().mockResolvedValueOnce(mockRestaurant);
            mockRestaurantService.deleteById = jest.fn().mockResolvedValueOnce(deleteMessage);

            const result = await controller.deleteRestaurant(mockRestaurant._id)
            expect(service.deleteById).toHaveBeenCalled()
            expect(result).toEqual(deleteMessage);
        })
    })

})