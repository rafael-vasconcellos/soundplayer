import Widget from './Widget'
import Info from './components/Info'
import { IAPI, ICustomTrack } from './API'




interface IPageProps {
    searchParams: {
        p: string
        s?: string
        imgs?: string
        color?: string
    }
}


const API_QUERY_PARAMS = process.env.API_QUERY_PARAMS
const API_KEY = process.env.API_KEY
const API_TRACK_URL = process.env.API_TRACK_URL
const headers = { 
    "Authorization": API_KEY ?? '',
    "Cache-Control": 'no-cache'
    //"Cache-Control": "public, max-age=3600, must-revalidate"
    // no-cache vs no-store
}

const hydratables = {
    playlist: '{"hydratable":"playlist"',
    sound: '{"hydratable":"sound"'
}

let error: string | null = null


async function getTracks(ids: string) { 
    if (!ids) { error = "error: 'Insert Valid Params!'" }
  
    return await fetch(API_TRACK_URL + ids + `&${API_QUERY_PARAMS}`, { 
        headers,
        //next: { revalidate: 60*2 }
    } ).then(response => { 
        if (response.status === 200) {
            return response.json()

        } else if (response.status === 401) { 
            error = "error: Expired token!"
            return null
        }

    } )  
}

  
function get_object(html: string, name: keyof typeof hydratables) { 

    if (!html || !name) { throw new Error("Invalid input string!") }
    const start = html.indexOf(hydratables[name])
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
    const { p, s, imgs: imgs_string, color } = searchParams
    const name = p? "playlist" : "sound"
    const playlist_path = p ?? s

    if (!playlist_path) { return <Info /> }
    if (!API_TRACK_URL || (!API_QUERY_PARAMS && !API_KEY)) { error = "Server Error: Ambient Variables Missing" }

    const page: IAPI = await fetch("https://soundcloud.com/" + playlist_path, { 
        headers,
        //next: { revalidate: 60*2 }
    } ).then( response => response.text() ).then( html => get_object(html, name) ).then(str => { 
            if (str) { 
                const response = JSON.parse(str)
                if (response?.data?.tracks?.length) { return response }
                else { 
                    return {
                        data: { tracks: [response?.data] }
                    }
                }
            } 
            else { throw new Error(`Failed to parse: ${str}`) }
    } )
    .catch(e => {error = e.message})
    console.log(JSON.stringify(page))


    // no objeto da playlist, as vezes algumas faixas tem um objeto praticamente vazio (remanescentes)
    // isso contorna essa situação
    const tracks = page?.data?.tracks
    const remnants = tracks?.filter(e => !e.media).map(e => { return {id: e.id, index: tracks.indexOf(e)} })
    const ids = remnants?.map(e => e.id).join(',') // ou %2C

    if (ids) {
        const requests = await getTracks(ids)
        remnants?.forEach(remnant => { if (requests?.length) {
            tracks[remnant.index] = requests?.find( (track: ICustomTrack) => remnant.id === track.id )
        } } )
    }



    // código referente a substituição das imagens de artwork
    const imgs = imgs_string?.replaceAll('https://', '')?.split(',') 
    imgs?.forEach(e => { 
        const [ id, ...link ] = e.split(':')
        const track: ICustomTrack | undefined = tracks?.find(track => track.id === Number(id))
        if (track) { track.updated_artwork = 'https://' + link.at(-1) }
        else if (id.includes('playlist')) { page.data.updated_artwork = link.at(-1) }
    } )

    return (
        <>
            {error && <p className='p-3'>{error}</p>}
            { (page?.data?.tracks?.length && !error) && <Widget api={ page } color={color}/> }
        </>
    )
}


