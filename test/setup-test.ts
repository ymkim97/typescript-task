import 'reflect-metadata';

import * as dotenv from 'dotenv';
import { container } from 'tsyringe';

import initContainer from '@loader/container';
import getApp from '@loader/expressApp';
import Mysql from '@loader/Mysql';

dotenv.config({ path: './env' });

initContainer();

export const app = getApp();
export const mysql = container.resolve(Mysql);
