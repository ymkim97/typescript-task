import { Container } from 'typedi';
import mysql from 'mysql2/promise';

export default (mysqlPool: mysql.Pool): void => {
  Container.set('mysqlPool', mysqlPool);
};
