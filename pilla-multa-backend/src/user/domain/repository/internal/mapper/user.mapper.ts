import { Types } from 'mongoose';
import { User, UserDocument } from '../../../model/document/user.document';
import { UserDTO } from '../../../model/dto/user.dto';
import { FzUtil } from '@core/util/fz-util';

export class UserMapper {
  static mapToUserDTO(user: User): UserDTO {
    if (FzUtil.isEmptyNull(user)) {
      return null;
    }
    const userDTO = new UserDTO();
    userDTO._id = user._id?.toString();
    userDTO.names = user?.names;
    userDTO.active = user?.active;
    userDTO.password = user?.password;
    userDTO.username = user?.username;
    userDTO.contact = user?.contact;
    return userDTO;
  }

  static mapToUser(userDTO: UserDTO): User {
    if (FzUtil.isEmptyNull(userDTO)) {
      return null;
    }
    const user = new User();
    user._id = new Types.ObjectId(userDTO?._id);
    user.active = userDTO?.active;
    user.names = userDTO?.names;
    user.password = userDTO?.password;
    user.username = userDTO?.username;
    user.contact = userDTO?.contact;
    return user;
  }
}
