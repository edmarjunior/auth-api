/* eslint-disable no-undef */

import request from 'supertest';
import app from '../../src/app';
import bcrypt from 'bcryptjs';
import Usuario from '../../src/app/models/Usuario';
import factoryAux from '../util/factoryAux';

async function post(usuario) {
	return await request(app)
		.post('/contas')
		.send(usuario);
}

async function postSemCampo(campo) {
	const usuario = await factoryAux.attrs_criar_conta();
	usuario[campo] = null;
	return await post(usuario);
}

describe('criar-conta', () => {
	
	// validando campos obrigatórios
	it('Não deve criar conta caso o campo [nome] não for enviado', async () => {
		const response = await postSemCampo('nome');
		expect(response.status).toBe(400);
	});

	it('Não deve criar conta caso o campo [sobrenome] não for enviado', async () => {
		const response = await postSemCampo('sobrenome');
		expect(response.status).toBe(400);
	});

	it('Não deve criar conta caso o campo [email] não for enviado', async () => {
		const response = await postSemCampo('email');
		expect(response.status).toBe(400);
	});

	it('Não deve criar conta caso o campo [senha] não for enviado', async () => {
		const response = await postSemCampo('senha');
		expect(response.status).toBe(400);
	});

	// validando quantidade minima de caracteres
	it('Não deve criar conta caso o campo [nome] não conter a quantidade [mínima de caracteres]', async () => {
		const usuario = await factoryAux.attrs_criar_conta();
		usuario.nome = ' A '; // minimo de 2 caracteres (espaço não deve contar)
		const response = await post(usuario);
		expect(response.status).toBe(400);
	});

	it('Não deve criar conta caso o campo [sobrenome] não conter a quantidade [mínima de caracteres]', async () => {
		const usuario = await factoryAux.attrs_criar_conta();
		usuario.sobrenome = ' A '; // minimo de 2 caracteres (espaço não deve contar)
		const response = await post(usuario);
		expect(response.status).toBe(400);
	});

	it('Não deve criar conta caso o campo [senha] não conter a quantidade [mínima de caracteres]', async () => {
		const usuario = await factoryAux.attrs_criar_conta();
		usuario.senha = ' 2345 '; // minimo de 6 caracteres (espaço não deve contar)
		const response = await post(usuario);
		expect(response.status).toBe(400);
	});

	// validando quantidade máxima de caracteres

	it('Não deve criar conta caso o campo [nome] ultrapassar quantidade [máxima de caracteres]', async () => {
		const usuario = await factoryAux.attrs_criar_conta();
		usuario.nome = '1234567890123456'; // máximo de 15 caracteres (espaço não deve contar)
		const response = await post(usuario);
		expect(response.status).toBe(400);
	});

	it('Não deve criar conta caso o campo [sobrenome] ultrapassar quantidade [máxima de caracteres]', async () => {
		const usuario = await factoryAux.attrs_criar_conta();
		usuario.sobrenome = '1234567890123456'; // máximo de 15 caracteres (espaço não deve contar)
		const response = await post(usuario);
		expect(response.status).toBe(400);
	});

	it('Não deve criar conta caso o campo [senha] ultrapassar quantidade [máxima de caracteres]', async () => {
		const usuario = await factoryAux.attrs_criar_conta();
		usuario.senha = '123456789012345678901'; // máximo de 20 caracteres (espaço não deve contar)
		const response = await post(usuario);
		expect(response.status).toBe(400);
	});

	// validações "e-mail"
	it('Não deve criar conta caso o campo e-mail estiver inválido', async () => {
		const usuario = await factoryAux.attrs_criar_conta();
		usuario.email = 'emailsemarroba.batata';
		const response = await post(usuario);
		expect(response.status).toBe(400);
	});

	it('Não deve criar conta com e-mail já cadastrado', async () => {
		const usuario = await factoryAux.attrs_criar_conta();
		await post(usuario);
		const response = await post(usuario);
		expect(response.status).toBe(400);
	});

	// Sucesso
	it('Deve criar conta', async () => {
		const usuario = await factoryAux.attrs_criar_conta();
		usuario.nome = ' 123456789012345 '; // máximo de 15 caracteres (espaço não deve contar)
		usuario.sobrenome = ' 123456789012345 '; // máximo de 15 caracteres (espaço não deve contar)
		usuario.senha = ' 12345678901234567890 '; // máximo de 20 caracteres (espaço não deve contar)

		const response = await post(usuario);
		expect(response.body.usuario).toHaveProperty('id');
    });

	it('Deve criar conta gerando corretamente a senha_hash', async () => {
		const usuario = await factoryAux.attrs_criar_conta();
		const response = await post(usuario);
		const usuarioCadastrado = await Usuario.findByPk(response.body.usuario.id);
		const compare = await bcrypt.compare(usuario.senha, usuarioCadastrado.senha_hash);
		expect(compare).toBe(true);
	});
});
