import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import { parseRequestJsonBody } from '../lib/body-parser'
import { EventStreams } from '../lib/event-streams'
import { Item } from '../lib/item'
import { getCollection } from '../lib/level'
import { respond, respondConflict, respondCreated } from '../lib/respond'

export async function putItemRoute(
    req: Http2ServerRequest,
    res: Http2ServerResponse,
    params: { collection?: string; id?: string }
): Promise<void> {
    const levelUp = getCollection(params.collection!)
    const body = await parseRequestJsonBody(req)

    // TODO LOCK Item id while get/put
    let existing: Item | undefined
    try {
        const existingString = (await levelUp.get(params.id!)) as string
        existing = JSON.parse(existingString) as Item
    } catch (err) {
        /* istanbul ignore else */
        if (err instanceof Error && err.name === 'NotFoundError') {
            existing = undefined
        } else {
            throw err
        }
    }
    if (existing) {
        if (body.rev !== existing.rev) {
            return respondConflict(res)
        }
        body.rev = existing.rev! + 1
    } else {
        body.id = '1'
        body.rev = 1
    }
    await levelUp.put(params.id!, JSON.stringify(body))
    try {
        if (existing) {
            EventStreams.broadCast(params.collection!, 'PUT', JSON.stringify({ id: body.id, rev: body.rev }))
        } else {
            EventStreams.broadCast(params.collection!, 'ADD', JSON.stringify({ id: body.id, rev: body.rev }))
        }
    } catch {
        // Do Nothing?
    }
    if (existing) {
        respond(res, { id: body.id, rev: body.rev })
    } else {
        respondCreated(res, { id: body.id, rev: body.rev })
    }
}
