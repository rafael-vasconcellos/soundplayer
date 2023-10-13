import Widget from './Widget'
import { IAPI, ICustomTrack } from './IAPI'




interface IPageProps {
    searchParams: {
        p: string
        imgs?: string
        color?: string
    }
}


const API_TRACK_URL = process.env.API_TRACK_URL
const PARAMS = process.env.PARAMS
const API_KEY = process.env.API_KEY


export async function getTracks(ids: string) { 
    if (!ids) { return {error: 'Insert Valid Params!'} }
    if (!API_TRACK_URL || !PARAMS) { return {error: 'Server Error: Ambient Variables Missing'} }

    return await fetch(API_TRACK_URL + ids + `&${PARAMS}`, { 
        headers: { "Authorization": API_KEY ?? '' }
    } ).then(response => response.json())

}


function get_object(html: string) { 
  html = html.replaceAll('"opus"', "")
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


  if (end != null) { return html.slice(start, end+1) }
  else { throw new Error('Failed to get the API JSON') }

}







export default async function Home( { searchParams }: IPageProps ) { 
    let error = null
    const { p, imgs: imgs_string, color } = searchParams
    const playlist_path = p
    if (!playlist_path) { return <p className='p-2'>Insert the playlist URL param!</p> }

    const page: IAPI = await fetch("https://soundcloud.com/" + playlist_path, {
        next: {
            revalidate: 60*2
        }
    } )
    .then(response => response.text()).then(res => get_object(res)).then(str => {
        if (str) {
            try { return JSON.parse(str) }
            catch (Exception) { console.error(Exception) }

        } else { throw new Error(`Failed to parse: ${str}`) }

    } ).catch(e => {error = e.message})



    // no objeto da playlist, as vezes algumas faixas tem um objeto praticamente vazio (remanescentes)
    // isso contorna essa situação
    const tracks = page?.data?.tracks
    const remnants = tracks?.filter(e => !e.media).map(e => { return {id: e.id, index: tracks.indexOf(e)} })
    const ids = remnants?.map(e => e.id).join(',') // ou %2C

    const requests = await getTracks(ids)
    remnants?.forEach( indice => { if (requests.length) {
        tracks[indice.index] = requests?.find((e: ICustomTrack) => indice.id === e.id)
    } } )



    const imgs = imgs_string?.replaceAll('https://', '')?.split(',') 
    imgs?.forEach(e => { 
        const [ id, ...link ] = e.split(':')
        const track: ICustomTrack | undefined = tracks?.find(e => e.id === Number(id))
        if (track) { track.updated_artwork = 'https://' + link[link.length-1] }
        else if (id.includes('playlist')) { page.data.updated_artwork = link[link.length-1] }
    } )

    
    return (
        <>
            {error && <main>{error}</main>}
            {page && <Widget api={page} color={color}/>}
        </>
    )
}


