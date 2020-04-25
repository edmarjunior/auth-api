/* eslint-disable no-undef */

import request from 'supertest';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

import app from '../../src/app';
import Usuario from '../../src/app/models/Usuario';
import factoryAux from '../util/factoryAux';
import authConfig from '../../src/config/auth';

function post({ email }) {
    return request(app)
        .post('/recuperar-senha')
		.send({ email });
}

describe('reenviar-senha', () => {
    it('Não deve reenviar senha caso o campo [email] estiver [ausente]', async () => {
        const response = await post({ email: null })
        expect(response.status).toBe(400);
    });

    it('Não deve reenviar senha caso o campo [email] estiver [inválido]', async () => {
        const response = await post({ email: 'emailsemarroba.invalido' })
        expect(response.status).toBe(400);
    });

    it('Não deve reenviar senha caso [não encontrado] conta de usuário com o campo [email]', async () => {
        const response = await post({ email: 'usuarioinexistente@gmail.com' })
        expect(response.status).toBe(400);
    });

    it('Deve reenviar senha', async () => {
        const usuario = await factoryAux.attrs_criar_conta();
        await Usuario.create(usuario);
        const response = await post({ email: usuario.email })
        expect(response.status).toBe(200);
    });

    it('Deve preencher o campo [data_solicitacao_reenvio_senha] ao reenviar a senha', async () => {
        const usuario = await factoryAux.attrs_criar_conta();
        
        // criando usuário
        const { id } = await Usuario.create(usuario);
        
        // reenviando a senha
        await post({ email: usuario.email })

        // validando a data de solicitação de reenvio
        const { data_solicitacao_reenvio_senha } = await Usuario.findByPk(id);

        const dataPreenchida = data_solicitacao_reenvio_senha !== null;

        expect(dataPreenchida).toBe(true);
    });

    it('Deve reenviar senha e retornar o [token] válido', async () => {
        const usuario = await factoryAux.attrs_criar_conta();
        
        // cadastrando usuário
        const { id, email } = await Usuario.create(usuario);
        
        // reenviando senha
        const response = await post({ email })
        
        // validando token
        const tokenGerado = response.body.token;
        const decoded = await promisify(jwt.verify)(tokenGerado, authConfig.secret);
		
		expect(decoded.id).toBe(id);
    });
});
