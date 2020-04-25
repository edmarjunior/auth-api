import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({ error: 'Token não enviado', code: 1 });
	}

	const [, token] = authHeader.split(' ');

	try {
		const decoded = await promisify(jwt.verify)(token, authConfig.secret);
		req.idUsuario = decoded.id;
		return next();
	} catch (err) {
		const response = {
			error: err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido',
			code: err.name === 'TokenExpiredError' ? 2 : 3
		}
		
		return res.status(401).json(response);
	}
};
