import { pool } from "../../config/db";

export const getAllUsers = async () => {
  const result = await pool.query(`
            SELECT * FROM users`);
  return result;
};

const updateUser = async (
  requester: Record<string, any>,
  targetUserId: number,
  userData: Record<string, any>
) => {
  // CUSTOMER: can update only own profile (no role)
  if (requester.role !== "admin") {
    const { name, email, password, phone } = userData;

    return pool.query(
      `
      UPDATE users
      SET name=$1,
          email=$2,
          password=$3,
          phone=$4
      WHERE id=$5
      RETURNING *;
      `,
      [name, email, password, phone, requester.id]
    );
  }

  // ADMIN: can update everything
  const { name, email, password, phone, role } = userData;

  return pool.query(
    `
    UPDATE users
    SET name=$1,
        email=$2,
        password=$3,
        phone=$4,
        role=$5
    WHERE id=$6
    RETURNING *;
    `,
    [name, email, password, phone, role, targetUserId]
  );
};

const deleteUser = async (userId: number) => {
  const result = await pool.query(
    ` DELETE FROM users
    WHERE id=$1
    RETURNING *;
    `,
    [userId]
  );
  return result;
};

export const userServices = {
  updateUser,
  getAllUsers,
  deleteUser,
};
