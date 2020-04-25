import * as Yup from 'yup';

export default async (req, res, next) => {
	try {
		const schema = Yup.object().shape({
			senha: Yup.string().required().min(6).max(20),
			senhaConfirmacao: Yup.string()
				.required()
				.oneOf([Yup.ref('senha')]),
		});

		// trim's
		req.body.senha = req.body.senha ? req.body.senha.trim() : req.body.senha;
		req.body.senhaConfirmacao = req.body.senhaConfirmacao ? req.body.senhaConfirmacao.trim() : req.body.senhaConfirmacao;
		
		await schema.validate(req.body, { abortEarly: false });
		return next();
	} catch (err) {
		return res
			.status(400)
			.json({ error: 'O campo de e-mail não foi informado ou está inválido', messages: err.inner });
	}
};
