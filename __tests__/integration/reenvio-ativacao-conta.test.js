/* eslint-disable no-undef */

import request from 'supertest';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

import app from '../../src/app';
import Usuario from '../../src/app/models/Usuario';
import authConfig from '../../src/config/auth';
import factoryAux from '../util/factoryAux';

async function post({ email }) {
	return await request(app)
		.post('/reenvio-ativacao-conta')
		.send({ email });
}

describe('reenvio-ativacao-conta', () => {
	it('Deve reenviar o e-mail de ativação de conta', async () => {
		const usuario = await factoryAux.attrs_criar_conta();
		
        // criando conta
		await Usuario.create(usuario);
		
		// reenviando e-mail
		const response = await post({ email: usuario.email });

		expect(response.status).toBe(200);
	});
	
	it('Deve reenviar o e-mail de ativação de conta com o token válido', async () => {
		const usuario = await factoryAux.attrs_criar_conta();
		
        // criando conta
		const { id } = await Usuario.create(usuario);
		
		// reenviando e-mail
		const response = await post({ email: usuario.email });

		// validando token
        const tokenGerado = response.body.token;
        const decoded = await promisify(jwt.verify)(tokenGerado, authConfig.secret);
		
		expect(decoded.id).toBe(id);
	});
	
	// validações "e-mail"
	it('Não deve reenviar o e-mail de ativação de conta caso o campo e-mail não for enviado', async () => {
		const response = await post({ email: null });
		
		expect(response.status).toBe(400);
	});

	it('Não deve reenviar o e-mail de ativação de conta caso o campo e-mail estiver inválido', async () => {
		const response = await post({ email: 'emailsemarroba.batata' });
		
		expect(response.status).toBe(400);
	});

	it('Não deve reenviar o e-mail de ativação de conta caso o e-mail não existir', async () => {
		const response = await post({ email: 'emailtesteinexistente@gmail.com' });
		
		expect(response.status).toBe(400);
	});
});
