import { NextApiRequest, NextApiResponse } from "next";
import { JSDOM } from "jsdom"


export default async function get_id(request: NextApiRequest, response: NextApiResponse) { 
    const { q } = request.query; 
    if (!q) { response.send( {error: 'Insert valid params!'} ) }

    const html = await fetch("https://soundcloud.com/" + q )
    .then(response => response.text())

    const page = new JSDOM(html).window.document
    const meta: any = page.querySelector('meta[property="twitter:app:url:iphone"]');
    if (meta) {
        response.send( {id: meta?.content?.split('//')[1]} )
    } else {
        response.send( {error: 'Not found!'} )
    }

}


// "mortal0/ele-te-bota-soca-soca"