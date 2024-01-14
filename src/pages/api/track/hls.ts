import { NextApiRequest, NextApiResponse } from "next";


type NextApiHeaders = NextApiRequest['headers']
interface Iheaders extends NextApiHeaders {url?: string}
const API_QUERY_PARAMS = process.env.API_QUERY_PARAMS
const API_KEY = process.env.API_KEY

export default async function getTrackHLS(request: NextApiRequest, response: NextApiResponse) { 

    const headers: Iheaders = request?.headers
    const url = headers?.url
    if (url) { 

        const fileURL = await fetch(url + '?' + API_QUERY_PARAMS, { 
            next: {
                revalidate: 30
            },
            headers: { 'Authorization': API_KEY ?? '' }
        } )
        .then(response => response.json()).then(res => res?.url ?? {})
        .catch(e => response.send(e))

        response.send(fileURL)
        /*
        const file = await fetch(fileURL)
        .then(response => response.text()).then(res => response.send(res))
        .catch(e => response.send(e))*/

    } else {
        response.send( {result: 'Error fetching file'} )
    }

}