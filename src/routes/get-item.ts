import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import { Item } from '../lib/item'
import { getCollection } from '../lib/level'
import { respond, respondNotFound, respondBadRequest } from '../lib/respond'

export async function getItemRoute(
    _req: Http2ServerRequest,
    res: Http2ServerResponse,
    params: { collection?: string; id?: string; rev?: string }
): Promise<void> {
    const levelUp = getCollection(params.collection!)
    const jsonString = (await levelUp.get(params.id!)) as string
    if (params.rev) {
        const item = JSON.parse(jsonString) as Item
        const rev = Number(params.rev)
        if (!Number.isInteger(rev)) {
            return respondBadRequest(res)
        }
        if (item.rev !== rev) {
            return respondNotFound(res)
        }
    }
    return respond(res, jsonString)
}
