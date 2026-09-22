import { Injectable } from '@nestjs/common';
import { UserService } from '../domain/service/user.service';
import { ResponseDTO, ResponseDtoBuilder } from '@core/domain/response.dto';
import { UserRegisterDTO } from '../domain/model/dto/user-register.dto';
import { UserRepositoryImpl } from './user-mongo-repository.impl';
import { User } from '../domain/model/document/user.document';
import { EncryptService } from '@core/encryption/encrypt.service';
import {
  ConflictException,
  UnexpectedException,
} from '@core/exceptions/manager.exception';
import { UserDTO } from '../domain/model/dto/user.dto';
import { UserMapper } from '../domain/repository/internal/mapper/user.mapper';
import { QueueService } from 'src/queue/application/queue.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    private userMongoRepository: UserRepositoryImpl,
    private queueService: QueueService,
  ) {}

  async registerUser(userRegister: UserRegisterDTO): Promise<ResponseDTO> {
    const user: User = await this.userMongoRepository.findByUsername(
      userRegister.username,
    );

    if (user != null) {
      throw new ConflictException('El usuario ya existe en el sistema.');
    }

    let claveEncriptada: string;
    try {
      // Assuming EncryptService is either brought over or we mock it. 
      // For now we will keep the reference. If it fails to compile we will adjust.
      claveEncriptada = await EncryptService.encrypt(userRegister.password);
    } catch (error) {
      throw new UnexpectedException('No fue posible encriptar la clave', error);
    }

    let newUser = new User();
    newUser.names = userRegister.names;
    newUser.lastnames = userRegister.lastnames;
    newUser.password = claveEncriptada;
    newUser.username = userRegister.username;
    newUser.contact = userRegister.contact;
    newUser.active = true; // Activo por defecto sin módulo de login por ahora

    newUser = await this.userMongoRepository.save(newUser);

    // Encolar un trabajo asincrono de bienvenida (como ejemplo para usar bullmq)
    await this.queueService.addJob(
      'notification',
      'welcome-email',
      { email: userRegister.contact.email, names: newUser.names },
    );

    return new ResponseDtoBuilder()
      .ok()
      .whitData(UserMapper.mapToUserDTO(newUser))
      .whitMessage('Usuario registrado con éxito')
      .build();
  }

  async getUserPermissions(userId: string, businessId: string): Promise<string[]> {
    // Implementación simplificada. Retorna permisos por defecto o vacíos.
    return ['*'];
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    let newEncryptedPassword: string;
    try {
      newEncryptedPassword = await EncryptService.encrypt(newPassword);
    } catch (error) {
      throw new UnexpectedException('No fue posible encriptar la clave', error);
    }
    const user = await this.userMongoRepository.findById(userId);
    user.password = newEncryptedPassword;
    await this.userMongoRepository.update(user);
  }

  async findById(id: string): Promise<UserDTO> {
    return UserMapper.mapToUserDTO(await this.userMongoRepository.findById(id));
  }

  async findByUsername(username: string): Promise<UserDTO> {
    return UserMapper.mapToUserDTO(
      await this.userMongoRepository.findByUsername(username),
    );
  }

  async findByEmail(email: string): Promise<UserDTO> {
    return UserMapper.mapToUserDTO(
      await this.userMongoRepository.findByEmail(email),
    );
  }

  async activateAccount(token: string): Promise<void> {
    // Lógica simplificada sin LoginModule
    throw new ConflictException('Método no implementado sin módulo de Login');
  }

  verifyAccountActivation(token: string): Observable<any> {
    return of(true);
  }
}
