import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import { EventStreams } from '../lib/event-streams'

export function getStreamRoute(_req: Http2ServerRequest, res: Http2ServerResponse): void {
    // todo handle query string ?events
    EventStreams.addClientEventStream('*', res)
}
