import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RoleRepository } from '../domain/repository/role.repository';
import { Role, RoleDocument } from '../domain/model/document/role.document';

@Injectable()
export class RoleMongoRepositoryImpl implements RoleRepository {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async findByName(name: string): Promise<Role> {
    return await this.roleModel.findOne({ name }).exec();
  }

  async findByNameWithPermissions(name: string): Promise<Role> {
    return await this.roleModel
      .findOne({ name })
      .populate('permissions')
      .exec();
  }

  async findById(id: string): Promise<Role> {
    return await this.roleModel.findById(id).exec();
  }

  async findAll(): Promise<Role[]> {
    return await this.roleModel.find().exec();
  }

  /** Upsert: creates if not found, updates permissions if found */
  async upsert(name: string, permissionIds: Types.ObjectId[]): Promise<Role> {
    return await this.roleModel
      .findOneAndUpdate(
        { name },
        { name, permissions: permissionIds },
        { upsert: true, new: true },
      )
      .exec();
  }

  async save(role: Role): Promise<Role> {
    const newRole = new this.roleModel(role);
    return await newRole.save();
  }
}
