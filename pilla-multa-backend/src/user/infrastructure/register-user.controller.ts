import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRegisterDTO } from '../domain/model/dto/user-register.dto';
import { ResponseDTO } from '@core/domain/response.dto';
import { UserServiceImpl } from '../application/user-service.impl';

@Controller('register-user')
@ApiTags('register-user')
export class RegisterUserController {
  constructor(private userServiceImpl: UserServiceImpl) {}

  @Post()
  @ApiOperation({
    description: 'Registra un nuevo cliente por formulario de la aplicación. ',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async registerUser(@Body() user: UserRegisterDTO): Promise<ResponseDTO> {
    return await this.userServiceImpl.registerUser(user);
  }
}
