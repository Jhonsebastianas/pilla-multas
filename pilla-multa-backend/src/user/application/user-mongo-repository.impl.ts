import { Model } from 'mongoose';
import { User, UserDocument } from '../domain/model/document/user.document';
import { UserMongoRepository } from '../domain/repository/internal/mongodb/user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserRepositoryImpl implements UserMongoRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async save(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async update(user: User): Promise<User> {
    return await this.userModel
      .findByIdAndUpdate(user._id, user, { new: true })
      .exec();
  }

  async delete(idUser: string): Promise<void> {
    await this.userModel.findByIdAndDelete(idUser).exec();
  }

  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({ username }).exec();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ 'contact.email': email }).exec();
  }
}
