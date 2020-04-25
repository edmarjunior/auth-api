import faker from 'faker';
import { factory } from 'factory-girl';

import Usuario from '../src/app/models/Usuario';

factory.define('criar-conta', Usuario, {
	nome: faker.name.firstName(),
	sobrenome: faker.name.lastName(),
	email: faker.internet.email(),
	senha: faker.internet.password(),
	data_ativacao: null,
});

factory.define('criar-login', Usuario, {
	email: faker.internet.email(),
	senha: faker.internet.password(),
});

export default factory;
