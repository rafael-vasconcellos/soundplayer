import { NextApiRequest, NextApiResponse } from "next";


type NextApiHeaders = NextApiRequest['headers']
interface Iheaders extends NextApiHeaders {url?: string}
const API_QUERY_PARAMS = process.env.API_QUERY_PARAMS
const API_KEY = process.env.API_KEY

export default async function getTrackHLS(request: NextApiRequest, response: NextApiResponse) { 

    const headers: Iheaders = request?.headers
    const url = headers?.url
    if (url) { 

        const fileURL: string = await fetch(url + '?' + API_QUERY_PARAMS, { 
            next: {
                revalidate: 30
            },
            headers: { 'Authorization': API_KEY ?? '' }
        } )
        .then(response => { 
            if (response.status===200) { return response.json() }

        }).then(res => res?.url ?? "")
        .catch(e => response.status(500).send(e))
        const status_code = fileURL? 200 : 500

        //console.log(fileURL, status_code)
        response.setHeader('Cache-Control', 'public, max-age=15, must-revalidate')
        response.status(status_code).send(fileURL)
        /*
        const file = await fetch(fileURL)
        .then(response => response.text()).then(res => response.send(res))
        .catch(e => response.send(e))*/

    } else {
        response.status(400).send( {result: 'URL header missing!'} )
    }

}