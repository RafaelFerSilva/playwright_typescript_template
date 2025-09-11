import { DbService } from '@services/DbService';
import { AllureLogger } from '@utils/AllureLogger';

export interface User {
  id: number;
  username: string;
  email: string;
}

export class UserRepository {
  constructor(private dbService: DbService) {}

  async getUserById(id: number): Promise<User | null> {
    return AllureLogger.step(`Buscar usuário pelo ID: ${id}`, async () => {
      const rows = await this.dbService.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows.length > 0 ? (rows[0] as User) : null;
    });
  }

  async insertUser(username: string, email: string): Promise<void> {
    return AllureLogger.step(`Inserir usuário: ${username}`, async () => {
      await this.dbService.execute('INSERT INTO users (username, email) VALUES (?, ?)', [username, email]);
    });
  }

  async updateUserEmail(id: number, newEmail: string): Promise<void> {
    return AllureLogger.step(`Atualizar email do usuário ID: ${id}`, async () => {
      await this.dbService.execute('UPDATE users SET email = ? WHERE id = ?', [newEmail, id]);
    });
  }

  async deleteUser(id: number): Promise<void> {
    return AllureLogger.step(`Deletar usuário ID: ${id}`, async () => {
      await this.dbService.execute('DELETE FROM users WHERE id = ?', [id]);
    });
  }
}
