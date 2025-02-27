import { NextApiRequest, NextApiResponse } from "next";


type NextApiHeaders = NextApiRequest['headers']
interface Iheaders extends NextApiHeaders {url?: string}
const API_QUERY_PARAMS = process.env.API_QUERY_PARAMS
const API_KEY = process.env.API_KEY

export default async function getTrackHLS(request: NextApiRequest, nextRes: NextApiResponse) { 
    const headers: Iheaders = request?.headers
    const url = headers?.url
    if (url) { 
        const response = await fetch(url + '?' + API_QUERY_PARAMS, { 
            next: { revalidate: 30 },
            headers: { 'Authorization': API_KEY ?? '' }
        } )
        //.catch(e => nextRes.status(500).send(e))


        const content_type = response.headers.get('Content-Type')
        const result = content_type==='application/json'?
            await response.json().then(res => res?.url ?? res) : 
            await response.text()
        if (response.ok) { nextRes.setHeader('Cache-Control', 'public, max-age=15, must-revalidate') }
        return nextRes.status(response.status).send(result)

    } else {
        nextRes.status(400).send( {result: 'URL header missing!'} )
    }
}