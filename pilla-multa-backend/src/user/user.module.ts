import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/model/document/user.document';
import { UserRepositoryImpl } from './application/user-mongo-repository.impl';
import { RegisterUserController } from './infrastructure/register-user.controller';
import { UserServiceImpl } from './application/user-service.impl';
import { Role, RoleSchema } from './domain/model/document/role.document';
import {
  Permission,
  PermissionSchema,
} from './domain/model/document/permission.document';
import { RoleMongoRepositoryImpl } from './application/role-mongo-repository.impl';
import { PermissionMongoRepositoryImpl } from './application/permission-mongo-repository.impl';
import { AccountActivationController } from './infrastructure/account-activation.controller';
import { ActivationStreamServiceImpl } from './infrastructure/streams/activation-stream-service.impl';

const documents = [
  { name: User.name, schema: UserSchema },
  { name: Role.name, schema: RoleSchema },
  { name: Permission.name, schema: PermissionSchema },
];

const repositories = [
  UserRepositoryImpl,
  RoleMongoRepositoryImpl,
  PermissionMongoRepositoryImpl,
];

const services = [UserServiceImpl, ActivationStreamServiceImpl];

const controllers = [RegisterUserController, AccountActivationController];

@Module({
  imports: [
    MongooseModule.forFeature(documents),
    // Removed LoginModule, BusinessModule, NotificationModule dependencies
  ],
  controllers,
  providers: [...repositories, ...services],
  exports: [...repositories, ...services],
})
export class UserModule {}
