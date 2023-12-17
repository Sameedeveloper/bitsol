import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: User[]; total: number; page: number; lastPage: number }> {
    const total = await this.userModel.countDocuments().exec();
    const data = await this.userModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const lastPage = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      lastPage,
    };
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password').exec();
  }

  async create(createUserDto: any): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return user.save();
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<any> {
    const result = await this.userModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return { message: 'User deleted successfully' };
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ email }).exec();
  }

  async comparePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async seedUsers() {
    const users = [];
    const password = 'Abde123@'; //move this to dotenv later
    const hashedPassword = await bcrypt.hash(password, 10);

    for (let i = 0; i < 10000; i++) {
      users.push({
        email: `user${i}@example.com`,
        password: hashedPassword,
        name: `user${i}`,
        addresses: [
          {
            addressLine1: `House#${i}`,
            addressLine2: `Street#${i}, Town Phase-${i % 10}`,
            city: `New City`,
            state: `New State`,
            country: `Newistan`,
          },
        ],
        role: `user`,
        phoneNo: `${i + (1 % 5)}${i + (1 % 2)}${i + (1 % 3)}${i + (1 % 2)}${
          i + (1 % 4)
        }${i + (1 % 5)}${i + (1 % 7)}${i + (1 % 6)}${i + (1 % 8)}${
          i + (1 % 7)
        }${i + (1 % 9)}`,
      });
    }

    await this.userModel.insertMany(users);
  }
}
