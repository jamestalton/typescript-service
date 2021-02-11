import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import { EventStreams } from '../lib/event-streams'
import { getCollection } from '../lib/level'

export async function deleteItemRoute(
    _req: Http2ServerRequest,
    res: Http2ServerResponse,
    params: { collection?: string; id?: string }
): Promise<void> {
    const levelUp = getCollection(params.collection!)
    await levelUp.del(params.id!)
    EventStreams.broadCast(params.collection!, 'DEL', JSON.stringify({ id: params.id }))
    return res.writeHead(200).end()
}
