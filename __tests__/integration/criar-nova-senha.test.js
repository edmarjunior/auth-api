/* eslint-disable no-undef */
import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../../src/app';
import authConfig from '../../src/config/auth';
import factoryAux from '../util/factoryAux';
import Usuario from '../../src/app/models/Usuario';

function put({ token, senha, senhaConfirmacao }){
    const recurso = '/nova-senha';

    if (token) {
        return request(app)
            .put(recurso)
            .set('authorization', `bearer ${token}`)
            .send({ senha, senhaConfirmacao });
    } 
    
    return request(app)
        .put(recurso)
        .send({ senha, senhaConfirmacao });
}

function gerarToken(expirado, id) {
    id = id ? id : 999999;
    return jwt.sign({ id }, authConfig.secret, {
        expiresIn: expirado ? 0 : '7d',
    });
}

describe('criar-nova-senha', () => {
    
    // validando o token enviado
    it('Não deve criar nova senha caso o [token] [não for enviado]', async () => {
        const response = await put({});
        const result = response.status === 401 && response.body.code === 1;
        expect(result).toBe(true);
    });

    it('Não deve criar nova senha caso o [token] estiver [mal formado]', async () => {
        const response = await put({ token: 'ABCDEFG123456' });
        const result = response.status === 401 && response.body.code === 3;
        expect(result).toBe(true);
    });

    it('Não deve criar nova senha caso o [token] estiver [expirado]', async () => {
        const tokenExpirado = gerarToken(true);
        const response = await put({ token: tokenExpirado });
        const result = response.status === 401 && response.body.code === 2;
        expect(result).toBe(true);
    });

    // campos obrigatórios
    it('Não deve criar nova senha caso o campo [senha] [não for preenchido]', async () => {
        const tokenValido = gerarToken();
        const response = await put({ token: tokenValido, senhaConfirmacao: 'teste123' });
        expect(response.status).toBe(400);
    });

    it('Não deve criar nova senha caso o campo [senhaConfirmacao] [não for preenchido]', async () => {
        const tokenValido = gerarToken();
        const response = await put({ token: tokenValido, senha: 'teste123' });
        expect(response.status).toBe(400);
    });

    // quantidade mínima de caracteres
    it('Não deve criar nova senha caso o campo [senha] não ter a quantidade [mínima de caracteres]', async () => {
        const tokenValido = gerarToken();
        const senha = ' 12345 '; // minimo de 6 caracteres (espaço não deve contar)
        const response = await put({ token: tokenValido, senha,  senhaConfirmacao: senha });
        expect(response.status).toBe(400);
    });

    // quantidade máxima de caracteres
    it('Não deve criar nova senha caso o campo [senha] ultrapassar a quantidade [máxima de caracteres]', async () => {
        const tokenValido = gerarToken();
        const senha = '1234567890123456789011233'; // máximo de 20 caracteres (espaço não deve contar)
        const response = await put({ token: tokenValido, senha,  senhaConfirmacao: senha });
        expect(response.status).toBe(400);
    });

    // demais validações
    it('Não deve criar nova senha caso o campo [senha] estiver [diferente] do campo [senhaConfirmacao]', async () => {
        const tokenValido = gerarToken();
        const response = await put({ token: tokenValido, senha: 'teste123',  senhaConfirmacao: '123teste' });
        expect(response.status).toBe(400);
    });

    it('Não deve criar nova senha caso não for encontrado o usuário contido no token', async () => {
        const tokenValido = gerarToken();
        const senha = 'teste123';
        const response = await put({ token: tokenValido, senha,  senhaConfirmacao: senha });
        expect(response.status).toBe(400);
    });

    it('Deve criar nova senha retornando status code 200', async () => {
        const usuario = await factoryAux.attrs_criar_conta();
        const { id } = await Usuario.create(usuario);
        const novaSenha = '  12345678901234567890  ';
        const tokenValido = gerarToken(false, id);
        const response = await put({ token: tokenValido, senha: novaSenha,  senhaConfirmacao: novaSenha });
        expect(response.status).toBe(200);
    });

    it('Deve criar nova senha e gerar a senha_hash corretamente', async () => {
        const usuario = await factoryAux.attrs_criar_conta();

        const { id } = await Usuario.create(usuario);
        const novaSenha = 'teste123Ok';

        const tokenValido = gerarToken(false, id);
        await put({ token: tokenValido, senha: novaSenha,  senhaConfirmacao: novaSenha });
        
        const usuarioAtualizado = await Usuario.findByPk(id);

        const senhaAtualizada = await usuarioAtualizado.checkSenha(novaSenha);

		expect(senhaAtualizada).toBe(true);
    });
});
