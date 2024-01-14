import Widget from './Widget'
import Info from './info'
import { IAPI, ICustomTrack } from './API'




interface IPageProps {
    searchParams: {
        p: string
        imgs?: string
        color?: string
    }
}


const PARAMS = process.env.PARAMS
const API_KEY = process.env.API_KEY
const API_TRACK_URL = process.env.API_TRACK_URL
let error: any = null


async function getTracks(ids: string) { 
    if (!ids) { error = "error: 'Insert Valid Params!'" }
  
    return await fetch(API_TRACK_URL + ids + `&${PARAMS}`, { 
        headers: { 
            "Authorization": API_KEY ?? '',
            //"Cache-Control": "public, max-age=3600, must-revalidate"
            // no-cache vs no-store
        },
        //next: { revalidate: 60*2 }
    } ).then(response => { 
        if (response.status === 401) { 
            error = "error: Expired token!"
            return null
        } else if (response.status === 200) {
            return response.json()
        }
    } )
  
}

  
function get_object(html: string) { 
    const start = html.indexOf('{"hydratable":"playlist"')
    if (start === -1) {return null}
    let end = null
    let count = null
    for (let i=start ; i<html.length ; i++) {
        if (html[i] === "{") {
            if (count === null) {count = 1}
            else { count++ }
        }
        else if (html[i] === "}") {
            if (count !== null) {count--}
        }
    
    
        if (count === 0) {end = i ; break}
    }



    if (end != null) { 
        const result = html.slice(start, end+1)
        return result.replaceAll(`\\\"`, `'`)
    
    } else { throw new Error('Failed to get the API JSON') }

}




export default async function Home( { searchParams }: IPageProps ) { 
    const { p: playlist_path, imgs: imgs_string, color } = searchParams
    if (!playlist_path) { return <Info /> }
    if (!API_TRACK_URL || (!PARAMS && !API_KEY)) { error = "Server Error: Ambient Variables Missing" }

    const page: IAPI = await fetch("https://soundcloud.com/" + playlist_path, { 
        headers: { 
            "Authorization": API_KEY ?? '',
            "Cache-Control": 'no-cache'
            //"Cache-Control": "public, max-age=3600, must-revalidate"
            // no-cache vs no-store (SSR)
        },
        //next: { revalidate: 60*2 }
    } ).then( response => response.text() ).then( html => get_object(html) ).then(str => { 
            if (str) { return JSON.parse(str) } 
            else { throw new Error(`Failed to parse: ${str}`) }
    } )
    .catch(e => {error = e.message})



    // no objeto da playlist, as vezes algumas faixas tem um objeto praticamente vazio (remanescentes)
    // isso contorna essa situação
    const tracks = page?.data?.tracks
    const remnants = tracks?.filter(e => !e.media).map(e => { return {id: e.id, index: tracks.indexOf(e)} })
    const ids = remnants?.map(e => e.id).join(',') // ou %2C

    const requests = await getTracks(ids)
    remnants?.forEach( indice => { if (requests?.length) {
        tracks[indice.index] = requests?.find((e: ICustomTrack) => indice.id === e.id)
    } } )



    // código referente a substituição das imagens de artwork
    const imgs = imgs_string?.replaceAll('https://', '')?.split(',') 
    imgs?.forEach(e => { 
        const [ id, ...link ] = e.split(':')
        const track: ICustomTrack | undefined = tracks?.find(e => e.id === Number(id))
        if (track) { track.updated_artwork = 'https://' + link[link.length-1] }
        else if (id.includes('playlist')) { page.data.updated_artwork = link[link.length-1] }
    } )

    return (
        <>
            {error && <p>{error}</p>}
            {page && !error && <Widget api={ page } color={color}/>}
        </>
    )
}


