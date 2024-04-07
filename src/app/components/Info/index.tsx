import './style.css'

export default function Info() { 

    return (
        <main className="p-8">
            <h1 className="font-bold text-4xl">SoundPlayer</h1>
            <p className="mb-8 mt-3">Custom player for soundcloud. Once up and running, you can use query parameters to customize the player the way you want, this way you can embed it anywhere you wants using iframe or other methods.</p>


            <div className='flex gap-2 items-start mt-4'>
                <h1 className="title">p:</h1>
                <p className='pt-1'>The <i>p</i> parameter refers to the playlist you want to pass to the app. It receives the playlist's url without the main domain.</p>
            </div>
            <p className="example">Example: playlistsmusic/sets/hits-of-the-80s-classic-pop</p>

            <div className='flex gap-2 items-start mt-4'>
                <h1 className="title">s:</h1>
                <p className='pt-1'>The <i>s</i> parameter refers to the single song you want to pass to the app. It receives the song's url without the main domain.</p>
            </div>
            <p className="example">Example: nikola-munjiza/solo-leveling-ost-full-looped-dark-aria-lv2-by-sawanohiroyuki</p>
            
            <div className='flex gap-2 items-start mt-4'>
                <h1 className="title">color:</h1>
                <p className='pt-1'>Sets the primary color of the player, it receives the color's hex code <b>without</b> the "#"</p>
            </div>

            <div className='flex gap-2 items-start mt-4'>
                <h1 className="title">imgs:</h1>
                <p className='pt-1'>With the <i>imgs</i> parameter you can replace the playlist's and its songs artwork. It receives the song id and the image url separated by commas and the link doesn't need to have the protocol.</p>
            </div>
            <p className="example">Example: playlist:link,id1:link,id2:link</p>
            

            <h1 className="title mt-8">How to get the song's id?</h1>
            <div>
                <p className='pt-1'>The API route <i>api/track/id/?q=song_url</i> returns the song's id</p>
                <p className="example">Song URL Example: roadrunner-usa/nickelback-far-away</p>
            </div>

            <div className="my-6">
                <h1 className="font-bold text-xl py-2">Environment Variables:</h1>
                <p>there are three ones. the URL path for one of the API calls, the one that returns the tracks from specified ids, the parameters that will be used on each API call and the API KEY.</p>
            </div>
        </main>
    )
}