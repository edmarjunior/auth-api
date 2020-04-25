
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import Usuario from '../models/Usuario';
import EnviarEmailAtivacaoContaService from '../services/EnviarEmailAtivacaoContaService';

class ReenvioAtivacaoContaController {
    async store(req, res) {
        const { email } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(400).json({ error: 'Conta não encontrada com o e-mail informado' });
        }

        if (usuario.data_ativacao) {
            return res.status(400).json({ error: 'A conta já está ativada, favor fazer o login' });
        }
        const { id, nome } = usuario;

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
}

export default new ReenvioAtivacaoContaController();
