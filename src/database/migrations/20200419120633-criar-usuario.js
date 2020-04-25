module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('usuarios', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			nome: {
				type: Sequelize.STRING(50),
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING(50),
				allowNull: false,
			},
			senha_hash: {
				type: Sequelize.STRING(100),
				allowNull: false,
			},
			data_cadastro: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			data_ativacao: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			data_solicitacao_reenvio_senha: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			data_reenvio_senha: {
				type: Sequelize.DATE,
				allowNull: true,
			}
		});
	},

	down: queryInterface => {
		return queryInterface.dropTable('usuarios');
	},
};
