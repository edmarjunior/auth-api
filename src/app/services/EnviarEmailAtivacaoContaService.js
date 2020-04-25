import Mail from '../../lib/Mail';

class EnviarEmailAtivacaoContaService {
    async run({ nome, email, token}) {
        await Mail.sendMail({
			to: `${nome} <${email}>`,
			subject: 'Ativação de conta',
			template: 'ativar-conta',
			context: {
				nome: nome,
				urlAtivarConta: `${process.env.WEB_URL}/ativar-conta?token=${token}`,
			},
		});
    }
}

export default new EnviarEmailAtivacaoContaService();