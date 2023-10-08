import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApp } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createRestAppContainer } from './rest/index.js';
import { createUserContainer } from './modules/user/index.js';

async function bootstrap() {
  const container = Container.merge(
    createRestAppContainer(),
    createUserContainer()
  );


  const app = container.get<RestApp>(Component.RestApp);
  await app.init();
}

bootstrap();
