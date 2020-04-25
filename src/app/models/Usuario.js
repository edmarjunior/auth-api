import Sequelize, { Model } from 'sequelize';
import bcrypt from "bcryptjs";

class Usuario extends Model {
	static init(sequelize) {
		super.init(
			{
				nome: Sequelize.STRING,
				sobrenome: Sequelize.VIRTUAL,
                email: Sequelize.STRING,
				senha: Sequelize.VIRTUAL,
                senha_hash: Sequelize.STRING,
                data_cadastro: Sequelize.DATE,
				data_ativacao: Sequelize.DATE,
				data_solicitacao_reenvio_senha: Sequelize.DATE,
				data_reenvio_senha: Sequelize.DATE,
			},
			{ sequelize }
		);
        
        this.addHook('beforeSave', async usuario => {
            if (!usuario.data_cadastro) {
				usuario.data_cadastro = new Date();
			}
            
			if (usuario.senha) {
				usuario.senha_hash = await bcrypt.hash(usuario.senha, 8);
			}

			if (usuario.nome && usuario.sobrenome) {
				usuario.nome += ` ${usuario.sobrenome}`
			}
		});

		return this;
	}

	checkSenha(senha) {
		return bcrypt.compare(senha, this.senha_hash);
	}
}

export default Usuario;
