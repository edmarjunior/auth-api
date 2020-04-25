
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import Usuario from '../models/Usuario';

class LoginController {
    async store(req, res) {
        const { email, senha } = req.body;
      
        const usuario = await Usuario.findOne({ where: { email } });
        
        if (!usuario || !(await usuario.checkSenha(senha))) {
			return res.status(400).json({ error: 'E-mail ou senha inválidos' });
        }
        
        if (!usuario.data_ativacao) {
			return res.status(400).json({ error: 'Conta ainda não ativada, favor verificar seu e-mail' });
        }

		const { id, nome } = usuario;

        return res.json({
            usuario: {
                id, 
                nome,
                email
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new LoginController();
