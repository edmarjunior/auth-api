import * as Yup from 'yup';

export default async (req, res, next) => {
	try {
		const schema = Yup.object().shape({
			email: Yup.string()
				.email()
				.required(),
			senha: Yup.string().required(),
		});

		await schema.validate(req.body, { abortEarly: false });
		return next();
	} catch (err) {
		return res
			.status(400)
			.json({ error: 'Os campos de e-mail ou senha estão inválidos', messages: err.inner });
	}
};
