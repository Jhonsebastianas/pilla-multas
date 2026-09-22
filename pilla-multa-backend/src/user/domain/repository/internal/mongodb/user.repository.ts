import { User } from '../../../model/document/user.document';

export interface UserMongoRepository {
  /**
   * User to register.
   * Created on 22/04/2024 at 07:10:59. <br>
   *
   * @param user registers a user in the database
   */
  save(user: User): Promise<User>;

  /**
   * User to update
   * Created on 22/04/2024 at 10:00:48. <br>
   *
   * @param user update a user in database.
   */
  update(user: User): Promise<User>;

  /**
   * User to delete.
   * Created on 22/04/2024 at 10:28:38. <br>
   *
   * @param idUser user id.
   */
  delete(idUser: string): Promise<void>;

  /**
   * Find user by id.
   * Created on 22/04/2024 at 07:13:47. <br>
   *
   * @param id user id.
   */
  findById(id: string): Promise<User>;

  /**
   * Find user by username.
   * Created on 22/04/2024 at 07:14:39. <br>
   *
   * @param username username of user.
   */
  findByUsername(username: string): Promise<User>;

  /**
   * Fing user by email.
   * Created on date 11/11/2024 at 12:03:26. <br>
   *
   * @param email email of user.
   */
  findByEmail(email: string): Promise<User>;
}
