import fastify from 'fastify';
import { appRoutes } from './htpp/routes';

export const app = fastify();

app.register(appRoutes);
