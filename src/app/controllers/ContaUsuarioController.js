
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import Usuario from '../models/Usuario';
import EnviarEmailAtivacaoContaService from '../services/EnviarEmailAtivacaoContaService';

class ContaUsuarioController {
    async store(req, res) {
        const { email } = req.body;

        const usuarioExistente = await Usuario.findOne({ where: { email } });

		if (usuarioExistente) {
			return res.status(400).json({ error: 'Já existe uma conta criada com esse e-mail' });
        }
        
        // Cadastrando usuário
        const { id, nome } = await Usuario.create(req.body);
        
        const token = jwt.sign({ id }, authConfig.secret);

        if (process.env.NODE_ENV !== 'test') {
            // Enviando e-mail
            await EnviarEmailAtivacaoContaService.run({ nome, email, token });
        }
        
        return res.json({
            usuario: {
                id,
                nome,
                email,
            },
            token,
        });
    }
    
    async update(req, res) {
        const usuario = await Usuario.findByPk(req.idUsuario, {
            attributes: ['id', 'nome', 'email']
        });

        if (!usuario.data_ativacao) {
            usuario.data_ativacao = new Date();
            usuario.save();
        }
        
        return res.json({
            usuario,
            token: jwt.sign({ id : usuario.id }, authConfig.secret, {
				expiresIn: authConfig.expiresIn,
			}),
        });
    }
}

export default new ContaUsuarioController();
