import * as Yup from 'yup';

export default async (req, res, next) => {
	try {
		const schema = Yup.object().shape({
			nome: Yup.string().required().min(2).max(15),
			sobrenome: Yup.string().required().min(2).max(15),
			senha: Yup.string().required().min(6).max(20),
			email: Yup.string()
				.email()
				.required(),
		});
		
		// trim's
		req.body.nome = req.body.nome ? req.body.nome.trim() : req.body.nome;
		req.body.sobrenome = req.body.sobrenome ? req.body.sobrenome.trim() : req.body.sobrenome;
		req.body.senha = req.body.senha ? req.body.senha.trim() : req.body.senha;

		// validação
		await schema.validate(req.body, { abortEarly: false });
		
		return next();
	} catch (err) {
		return res
			.status(400)
			.json({ error: 'Os dados preenchidos estão inválidos', messages: err.inner });
	}
};
