import 'reflect-metadata';

import { container } from 'tsyringe';

import initContainer from '@loader/container';
import getApp from '@loader/expressApp';
import Mysql from '@loader/Mysql';

initContainer();

export const app = getApp();
export const mysql = container.resolve(Mysql);
