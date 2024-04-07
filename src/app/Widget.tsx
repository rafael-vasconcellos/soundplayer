import Player from "./components/Player"
import { IAPI } from "./API"
import Image from 'next/image'
import soundcloud from '../../public/soundcloud.svg'



const Widget: React.FC<{api: IAPI, color: string | undefined}> = function( {api, color} ) { 
    const track = api?.data?.tracks[0]
    const albumArtwork = api?.data?.artwork_url ?? api?.data?.tracks[0]?.artwork_url
    const artwork = api?.data?.updated_artwork ?? albumArtwork?.replace("large", 't500x500')
    

    return (
        <main className='bg-zinc-800 flex gap-1 relative h-screen'
        style={ { 
            backgroundColor: color? `#${color}` : '',
            //width: '400px', height: '125px'
        } }>

            <img src={ artwork } className='bg-zinc-400 object-fill object-center' style={ {minWidth: '125px'} } />

            <div className="flex flex-col items-center h-full w-4/5 relative">
                <a className="font-bold" id="title" href={track?.permalink_url} target="_blank">{track?.title?.slice(0, 24) + '...'}</a>
                <Player api={api} />
                <p className="text-xs absolute bottom-0 w-full">
                    <a href={api?.data?.permalink_url} target="_blank">
                        { (api?.data?.title??'') +' by '+ api?.data?.tracks[0]?.user?.username }
                    </a>
                    <span className="px-2">{'1 / '+api?.data?.tracks?.length}</span>
                </p>
            </div>

            <a className="absolute bottom-1 right-1" href="https://www.soundcloud.com/" target="_blank">
                <Image src={soundcloud} alt="soundcloud logo" width="80" height="11" />
            </a>

      </main>
    )
}


export default Widget




