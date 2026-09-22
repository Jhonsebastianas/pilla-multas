import { ContactDTO } from './contact.dto';

export class UserDTO {
  _id: string;
  names: string;
  username: string;
  password: string;
  contact: ContactDTO;
  active: boolean;
}
