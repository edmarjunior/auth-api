/* eslint-disable no-undef */

import request from 'supertest';
import app from '../../src/app';
import Usuario from '../../src/app/models/Usuario';
import factoryAux from '../util/factoryAux';

async function ativar({ id, token }){
    const recurso = `/contas/${id}/ativar`;
    
    if (token) {
        return  await request(app)
            .put(recurso)
            .set('authorization', `bearer ${token}`);
    } 
    
    return  await request(app).put(recurso);
}

describe('ativar-conta', () => {
	it('Deve ativar', async () => {
        const usuario = await factoryAux.attrs_criar_conta();

        const response = await request(app)
            .post('/contas')
            .send(usuario);
        
        const { id } = response.body.usuario;
        const { token } = response.body;

        await ativar({ id, token });

        const usuarioCadastrado = await Usuario.findByPk(id);
        const dataPreenchida = usuarioCadastrado.data_ativacao != null;
        
        expect(dataPreenchida).toBe(true);
    });
    
    it('Deve validar token não enviado', async () => {
        const response = await ativar({ id: 1});
        const result = response.status === 401 && response.body.code === 1;
        expect(result).toBe(true);
    });

    it('Deve validar token inválido', async () => {
        const response = await ativar({ id: 1, token: 'ABCDEFG123456' });
        const result = response.status === 401 && response.body.code === 3;
        expect(result).toBe(true);
    });
});
