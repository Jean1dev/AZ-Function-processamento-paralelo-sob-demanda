import { AzureFunction, Context } from "@azure/functions"
import { IFolha } from '../@types/types'
import { CosmosClient } from '@azure/cosmos'

const COSMOS_URL = 'https://cosmos-db-jean.documents.azure.com:443/'
const COSMOS_KEY = 'te6NrywJWGN6wAXQPl0DVZUns1fLZ23Vy5orVnTHTd3mD2pzaFcJhKbwPFuTEk5zk16hPMoHDMNP6U1siK4tUQ=='
const DATABASE_ID = 'mydb'

const serviceBusQueueTrigger: AzureFunction = async function(context: Context, message: IFolha): Promise<void> {
    context.log('processando folha do ', message.nome)

    const calcular = (folha: IFolha) => {
        folha.salarioCalculado = folha.salario * (folha.bonus * folha.mesesTrabalhados)
    }

    calcular(message)

    const client = new CosmosClient({
        endpoint: COSMOS_URL,
        key: COSMOS_KEY
    })

    context.log('calculo feito')

    const db = client.database(DATABASE_ID)
    const container = db.container('processamento-folhas')
    await container.items.create(message)

    context.log('calculo registrado no banco de dados')
}

export default serviceBusQueueTrigger
