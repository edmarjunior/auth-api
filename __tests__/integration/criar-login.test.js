/* eslint-disable no-undef */

import request from 'supertest';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

import app from '../../src/app';
import factory from '../factories';
import Usuario from '../../src/app/models/Usuario';
import authConfig from '../../src/config/auth';
import factoryAux from '../util/factoryAux';

const factories = {
    criar_login: 'criar-login'
}

async function post(usuario) {
	return await request(app)
        .post('/login')
        .send(usuario);
}

describe('criar-login', () => {
	it('Deve criar login', async () => {
		const usuario = await factoryAux.attrs_criar_conta();
        
        // criando conta
        const { id } = await Usuario.create(usuario);

        // ativando conta
        const usuarioCadastrado = await Usuario.findByPk(id);
        usuarioCadastrado.data_ativacao = new Date();
        usuarioCadastrado.save();

        // fazendo login
		const responseLogin = await post(usuario);
        
		expect(responseLogin.body.usuario).toHaveProperty('id');
    });

    // validando token gerado
    it('Deve criar login com token válido', async () => {
		const usuario = await factoryAux.attrs_criar_conta();
        
        // criando conta
        const { id } = await Usuario.create(usuario);
        
        // ativando conta
        const usuarioCadastrado = await Usuario.findByPk(id);
        usuarioCadastrado.data_ativacao = new Date();
        usuarioCadastrado.save();

        // fazendo login
        const responseLogin = await post(usuario);
        
        // validando token
        const tokenGerado = responseLogin.body.token;
        const decoded = await promisify(jwt.verify)(tokenGerado, authConfig.secret);
		
		expect(decoded.id).toBe(id);
    });

    // validações "e-mail"
    it('Não deve criar login caso o campo e-mail não for enviado', async () => {
        const usuario = await factoryAux.attrs_criar_conta();
        usuario.email = null;
        
		const response = await post(usuario);
        
        expect(response.status).toBe(400);
    });

    it('Não deve criar login caso o campo e-mail estiver inválido', async () => {
		const usuario = await factory.attrs(factories.criar_login, {
            email: 'emailsemarroba.batata',
        });
        
		const response = await post(usuario);
        
        expect(response.status).toBe(400);
    });

    it('Não deve criar login caso o e-mail não existir', async () => {
		const usuario = await factory.attrs(factories.criar_login, {
            email: 'emailtesteinexistente@gmail.com',
        });
        
		const response = await post(usuario);
        
        expect(response.status).toBe(400);
    });

    // validações "senha"
    it('Não deve criar login caso a senha não for enviada', async () => {
		const usuario = await factory.attrs(factories.criar_login, {
            senha: null,
        });
        
		const response = await post(usuario);

        expect(response.status).toBe(400);
    });

    it('Não deve criar login caso a senha estiver incorreta', async () => {
		const usuario = await factoryAux.attrs_criar_conta();
        
        usuario.senha = 'teste123';

        // criando conta
        const { id } = await Usuario.create(usuario);

        // ativando conta
        const usuarioCadastrado = await Usuario.findByPk(id);
        usuarioCadastrado.data_ativacao = new Date();
        usuarioCadastrado.save();

        // mudando para uma senha incorreta
        usuario.senha = 'senhaincorreta';

        // fazendo login
		const responseLogin = await post(usuario);
		
		expect(responseLogin.status).toBe(400);
    });

    // validando conta ainda não ativada
    it('Não deve criar login caso a conta ainda não estiver ativa', async () => {
		const usuario = await factoryAux.attrs_criar_conta();
        
        // criando conta
        await Usuario.create(usuario);
        
        // fazendo login
		const responseLogin = await post(usuario);
		
		expect(responseLogin.status).toBe(400);
    });
});
