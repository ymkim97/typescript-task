import { PoolConnection } from 'mysql2/promise';

import { ERROR_MESSAGE } from '@constant/ErrorMessageConstant';
import { STATUS_CODE } from '@constant/StatusConstant';
import RequestError from '@error/RequestError';
import SqlError from '@error/SqlError';

export async function executeQuery<T>(
  connection: PoolConnection,
  repositoryFunction: () => Promise<T>,
): Promise<T> {
  try {
    return await repositoryFunction();
  } catch (e) {
    if (e instanceof RequestError) throw e;

    throw new SqlError(
      ERROR_MESSAGE.SQL_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      e as Error,
    );
  } finally {
    connection.release();
  }
}

export async function executeQueryTransaction<T>(
  connection: PoolConnection,
  repositoryFunction: () => Promise<T>,
): Promise<T> {
  try {
    await connection.beginTransaction();
    const result = await repositoryFunction();
    await connection.commit();

    return result;
  } catch (e) {
    if (e instanceof RequestError) throw e;

    throw new SqlError(
      ERROR_MESSAGE.SQL_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      e as Error,
    );
  } finally {
    connection.release();
  }
}
