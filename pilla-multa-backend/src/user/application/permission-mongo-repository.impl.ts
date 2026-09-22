import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PermissionRepository } from '../domain/repository/permission.repository';
import {
  Permission,
  PermissionDocument,
} from '../domain/model/document/permission.document';

@Injectable()
export class PermissionMongoRepositoryImpl implements PermissionRepository {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
  ) {}

  async findByAction(action: string): Promise<Permission> {
    return await this.permissionModel.findOne({ action }).exec();
  }

  async findAll(): Promise<Permission[]> {
    return await this.permissionModel.find().exec();
  }

  /** Upsert: creates if not found, updates description/module if found */
  async upsert(
    action: string,
    description: string,
    module: string,
  ): Promise<Permission> {
    return await this.permissionModel
      .findOneAndUpdate(
        { action },
        { action, description, module },
        { upsert: true, new: true },
      )
      .exec();
  }

  async save(permission: Permission): Promise<Permission> {
    const newPermission = new this.permissionModel(permission);
    return await newPermission.save();
  }
}
