import { PoolConnection } from 'mysql2/promise';

import { ERROR_CODE, ERROR_MESSAGE } from '@constant/ErrorConstant';
import SqlError from '@error/SqlError';

export async function executeReadQuery<T>(
  connection: PoolConnection,
  repositoryFunction: () => Promise<T>,
): Promise<T> {
  try {
    return await repositoryFunction();
  } catch (e) {
    throw new SqlError(
      ERROR_MESSAGE.SQL_READ_ERROR,
      ERROR_CODE.SERVER,
      e as Error,
    );
  } finally {
    connection.release();
  }
}

export async function executeWriteQuery<T>(
  connection: PoolConnection,
  repositoryFunction: () => Promise<T>,
): Promise<T> {
  try {
    await connection.beginTransaction();
    const result = await repositoryFunction();
    await connection.commit();

    return result;
  } catch (e) {
    throw new SqlError(
      ERROR_MESSAGE.SQL_WRITE_ERROR,
      ERROR_CODE.SERVER,
      e as Error,
    );
  } finally {
    connection.release();
  }
}
