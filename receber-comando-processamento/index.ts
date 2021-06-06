import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ServiceBusClient } from '@azure/service-bus'
import * as faker from 'faker'

const SERVICE_BUS_CONNECTION = ''
const QUEUE_NAME = 'processamento-folhas'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const folhas = []
    for (let index = 0; index < 100; index++) {
        folhas.push({
            nome: faker.name.firstName(),
            salario: faker.random.number(),
            bonus: 0.5,
            mesesTrabalhados: faker.random.number(12)
        })

    }

    const client = new ServiceBusClient(SERVICE_BUS_CONNECTION)
    const sender = client.createSender(QUEUE_NAME)
    folhas.forEach(folha => sender.sendMessages({ body: folha }))

    context.res = {
        status: 202,
        body: `Processando ${folhas.length} folhas de pagamento`
    };

};

export default httpTrigger;
