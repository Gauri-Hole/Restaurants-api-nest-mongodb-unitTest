import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { userRoles } from '../auth/schemas/user.schema';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurants.schema';

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

const mockRestaurantService = {
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let model: Model<Restaurant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: getModelToken(Restaurant.name),
          useValue: mockRestaurantService
        }
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService)
    model = module.get<Model<Restaurant>>(getModelToken(Restaurant.name))
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should be find all the restaurants', async () => {
      jest.spyOn(model, 'find').mockImplementationOnce(() => ({
        limit: () => ({
          skip: jest.fn().mockResolvedValue([mockRestaurant])
        })
      } as any));
      const restaurant = await service.findAll({ keyword: 'restaurant' });
      expect(restaurant).toEqual([mockRestaurant]);
    });
  });

  describe('create', () => {
    const newRestaurant = {
      name: "Retaurant 3",
      description: "This is just a description",
      email: "gauri@gamil.com",
      phoneNo: 9788246116,
      address: "200 Olympic Dr, Stafford, VS, 22554",
      category: "fast food",
    }

    it('should create the new restaurant', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve(mockRestaurant));
      const result = await service.create(newRestaurant as any, mockUser as any)
      expect(result).toEqual(mockRestaurant);
    })
  });

  describe('findById', () => {
    it('should get restaurant by id', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(mockRestaurant as any)
      const result = await service.findById(mockRestaurant._id)
      expect(result).toEqual(mockRestaurant);
    })

    it('should throw wrong mongoose Id error', async () => {
      await expect(service.findById('wrongId')).rejects.toThrow(BadRequestException)
    })

    it('should throw restaurant not found error', async () => {
      const mockError = new NotFoundException('Restaurant not found')
      jest.spyOn(model, 'findById').mockRejectedValue(mockError)

      await expect(service.findById(mockRestaurant._id)).rejects.toThrow(NotFoundException)
    })
  })

  describe('updateById', () => {
    it('should update the reataurant', async () => {
      const restaurant = { ...mockRestaurant, name: 'updated' }
      const newRestaurant = {
        name: "updated"
      }
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(restaurant as any)
      const result = await service.updateById(mockRestaurant._id, newRestaurant as any)
      expect(result.name).toEqual(newRestaurant.name);
    })
  })

  describe('deleteById', () => {
    it('should delete the restaurant', async () => {
      const deleteMessage = { deleted: true }
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValueOnce(deleteMessage as any)
      const result = await service.deleteById(mockRestaurant._id)
      expect(result).toEqual(deleteMessage)
    })
  })

});
