require('../bootstrap');

module.exports = {
	dialect: process.env.DB_DIALECT || 'postgres',
	host: process.env.DB_HOST_DOCKER || process.env.DB_HOST,
	port: process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	storage: './__tests__/database.sqlite',
	logging: false,
	define: {
		timestamps: false, // 'true' obrigará a criar as colunas 'created_at' e 'updated_at' nas migrations
		underscored: true,
		underscoredAll: true,
	},
};
