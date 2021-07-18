import {SiteClient} from 'datocms-client';

export default async function recebedorDeRequests(request, response) {

    if (request.method === 'POST') {
        const TOKEN = '37f3d153211df0fc6224ee0daf2703';
        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "976607", // model ID criado pelo Dato
            ...request.body
        })

        console.log(registroCriado);
        
        console.log(TOKEN)
        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado,
        })
        return;
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })
}