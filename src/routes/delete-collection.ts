import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import { getCollection } from '../lib/level'
import { respondOK } from '../lib/respond'

export async function deleteCollectionRoute(
    _req: Http2ServerRequest,
    res: Http2ServerResponse,
    params: { collection?: string; id?: string }
): Promise<void> {
    const levelUp = getCollection(params.collection!)
    await levelUp.clear()
    return respondOK(res)
}
