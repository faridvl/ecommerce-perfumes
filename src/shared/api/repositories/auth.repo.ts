import sql from '@/lib/db';
import { User } from '@/types/auth/auth';

interface UserRow {
  id: number;
  uuid: string;
  email: string;
  password: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

function mapRowToUser(userRow: UserRow): User {
  return {
    id: userRow.uuid,
    name: userRow.full_name,
    fullName: userRow.full_name,
    email: userRow.email,
    role: userRow.role,
  };
}

export const AuthRepo = {
  findByEmail: async (email: string): Promise<(User & { password: string }) | null> => {
    const userRows = await sql`
      SELECT id, uuid, email, password, full_name, role, is_active
      FROM users
      WHERE email = ${email}
        AND is_active = true
      LIMIT 1
    `;

    if (!userRows[0]) return null;

    const userRow = userRows[0] as unknown as UserRow;
    return {
      ...mapRowToUser(userRow),
      password: userRow.password,
    };
  },
};
