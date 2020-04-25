import factory from '../factories';

let contador = 0;

const factories = {
	criar_conta: 'criar-conta',
}

export default {
    attrs_criar_conta: async () =>  {
        const attrs = await factory.attrs(factories.criar_conta);

        attrs.email = attrs.email.replace('@', `${contador}@`);
        contador += 1;
    
        return attrs;
    }
}
