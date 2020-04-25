import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import Usuario from '../models/Usuario';
import Mail from '../../lib/Mail';

class RecuperarSenhaController {
    async store(req, res) {
        const { email } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(400).json({ error: 'Este e-mail ainda não possui conta cadastrada'});
        }

        usuario.data_solicitacao_reenvio_senha = new Date();

        const  { id, nome } = usuario;

        const token = jwt.sign({ id }, authConfig.secret);

        if (process.env.NODE_ENV !== 'test') { 
            // Enviando e-mail
            await Mail.sendMail({
                to: `${nome} <${email}>`,
                subject: 'Recuperação de senha',
                template: 'recuperar-senha',
                context: {
                    nome,
                    urlNovaSenha: `${process.env.WEB_URL}/nova-senha?token=${token}`,
                }
            });
        }

        usuario.data_reenvio_senha = new Date();
        usuario.save();

        return res.json({ token });
    }

    async update(req, res) {
        const usuario = await Usuario.findByPk(req.idUsuario);

        if (!usuario) {
            return res.status(400).json({ error: 'Não encontramos seu usuário, favor criar uma nova conta' });
        }

        usuario.senha = req.body.senha;
        usuario.save();

        return res.json({
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            },
            token: jwt.sign({ id: usuario.id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new RecuperarSenhaController();
