import { ResponseDTO } from '@core/domain/response.dto';
import { UserRegisterDTO } from '../model/dto/user-register.dto';
import { UserDTO } from '../model/dto/user.dto';
import { Observable } from 'rxjs';

export interface UserService {
  /**
   * Register a user to the application.
   * Created on 23/04/2024 at 11:35:00. <br>
   *
   * @param userRegister user to register in the app.
   */
  registerUser(userRegister: UserRegisterDTO): Promise<ResponseDTO>;

  /**
   * Change password
   * Created on date 12/11/2024 at 16:17:48. <br>
   *
   * @param userId
   * @param newPassword password to change
   */
  changePassword(userId: string, newPassword: string): Promise<void>;

  /**
   * find user by id
   * Created on date 12/11/2024 at 16:13:21. <br>
   *
   * @param id userId
   */
  findById(id: string): Promise<UserDTO>;

  /**
   * find user by username.
   * Created on 24/04/2024 at 15:35:38. <br>
   *
   * @param username user access
   */
  findByUsername(username: string): Promise<UserDTO>;

  /**
   * Find user by email.
   * @param email user email.
   */
  findByEmail(email: string): Promise<UserDTO>;

  /**
   *
   * @param userId user identifyer
   * @param businessId business identifier
   */
  getUserPermissions(userId: string, businessId: string): Promise<string[]>;

  /**
   * Activate user account.
   * @param token activation token
   */
  activateAccount(token: string): Promise<void>;

  /**
   * Verify whether the user has already activated their account <br>
   * Created on date 19/02/2026 at 18:41:54. <br>
   *
   * @author <a href="https://www.jhonsebastianas.com/">Sebastian Agudelo</a></br>
   * @param token verification token
   */
  verifyAccountActivation(token: string): Observable<any>;
}
