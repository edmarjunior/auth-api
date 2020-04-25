import { Router } from 'express';
import authMiddleware from './app/middlewares/auth';

// controllers
import ContaUsuarioController from './app/controllers/ContaUsuarioController';
import LoginController from './app/controllers/LoginController';
import ReenvioAtivacaoContaController from './app/controllers/ReenvioAtivacaoContaController';
import RecuperarSenhaController from './app/controllers/RecuperarSenhaController';

// validators
import LoginStoreValidate from './app/validators/LoginStoreValidate';
import ReenvioEmailAtivacaoContaValidate from './app/validators/ReenvioEmailAtivacaoContaValidate';
import ContaUsuarioStoreValidate from './app/validators/ContaUsuarioStoreValidate';
import RecuperarSenhaStoreValidate from './app/validators/RecuperarSenhaStoreValidate';
import RecuperarSenhaUpdateValidate from './app/validators/RecuperarSenhaUpdateValidate';

const routes = new Router();

// ping
routes.get('/ping', (req, res) => res.json({ status_api: 'Ok' }));

// criar conta
routes.post('/contas', ContaUsuarioStoreValidate, ContaUsuarioController.store);

// login
routes.post('/login', LoginStoreValidate, LoginController.store);

// reenviar e-mail ativação de conta
routes.post('/reenvio-ativacao-conta', ReenvioEmailAtivacaoContaValidate, ReenvioAtivacaoContaController.store);

// recuperar senha
routes.post('/recuperar-senha', RecuperarSenhaStoreValidate, RecuperarSenhaController.store);

/**
 * ativando autenticação nas rotas abaixo
 */
routes.use(authMiddleware);

// ativar conta
routes.put('/contas/:id/ativar', ContaUsuarioController.update);

// nova senha
routes.put('/nova-senha', RecuperarSenhaUpdateValidate, RecuperarSenhaController.update);

export default routes;
