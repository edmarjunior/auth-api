import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import Usuario from '../app/models/Usuario';

const models = [ Usuario ];

class Database {
	constructor() {
		this.init();
	}

	init() {
		this.connection = new Sequelize(databaseConfig);

		models.map(model => model.init(this.connection));

		models.forEach(model => {
			if (model.associate) model.associate(this.connection.models);
		});
	}
}

export default new Database();
