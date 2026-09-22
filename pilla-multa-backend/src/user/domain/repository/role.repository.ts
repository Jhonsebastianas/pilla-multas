import { Role } from '../model/document/role.document';

export interface RoleRepository {
  findByName(name: string): Promise<Role>;
  findByNameWithPermissions(name: string): Promise<Role>;
  findById(id: string): Promise<Role>;
  save(role: Role): Promise<Role>;
}
