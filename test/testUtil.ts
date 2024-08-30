import { mysql } from '@test/setup-test';

export async function truncateStudent() {
  const connection = await mysql.getConnection();
  await connection.query('set FOREIGN_KEY_CHECKS = 0;');
  await connection.query('TRUNCATE TABLE student;');
  await connection.query('set FOREIGN_KEY_CHECKS = 1;');
  connection.release();
}

export async function truncateCourse() {
  const connection = await mysql.getConnection();
  await connection.query('set FOREIGN_KEY_CHECKS = 0;');
  await connection.query('TRUNCATE TABLE course;');
  await connection.query('set FOREIGN_KEY_CHECKS = 1;');
  connection.release();
}

export async function truncateClass() {
  const connection = await mysql.getConnection();
  await connection.query('set FOREIGN_KEY_CHECKS = 0;');
  await connection.query('TRUNCATE TABLE class;');
  await connection.query('set FOREIGN_KEY_CHECKS = 1;');
  connection.release();
}
