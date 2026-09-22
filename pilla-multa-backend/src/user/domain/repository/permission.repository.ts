import { Permission } from '../model/document/permission.document';

export interface PermissionRepository {
  findByAction(action: string): Promise<Permission>;
  save(permission: Permission): Promise<Permission>;
}
