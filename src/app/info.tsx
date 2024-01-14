export default function Info() {

    return (
        <main className="flex flex-col gap-3 p-8">
            <h1 className="font-bold text-4xl">SoundPlayer</h1>
            <p>Custom player for soundcloud. Once up and running, you can use query parameters to customize the player the way you want, this way you can embed it anywhere you wants using iframe or other methods.</p>

            <h1 className="font-bold text-2xl">p</h1>
            <p>The <i>p</i> parameter refers to the playlist you want to pass to the app. It only works with playlist, it <b>doesn't work with single songs</b>. It receives the playlist's url without the main domain.</p>
            <p>Example: playlistsmusic/sets/hits-of-the-80s-classic-pop</p>

            <h1 className="font-bold text-2xl">color</h1>
            <p>Sets the primary color of the player, it receives the color's hex code <b>without</b> the "#"</p>

            <h1 className="font-bold text-2xl">imgs</h1>
            <p>With the <i>imgs</i> parameter you can replace the playlist's and its songs artwork. It receives the song id and the image url separated by commas and the link doesn't need to have the protocol.</p>
            <p>Example: playlist:link,id1:link,id2:link</p>

            <h1 className="font-bold text-2xl">How to get the song's id?</h1>
            <p>The API route <i>api/track/id/?q=song_url</i> returns the song's id</p>
            <p>Song URL Example: roadrunner-usa/nickelback-far-away</p>

            <h1 className="font-bold text-xl">Environment Variables</h1>
            <p>there are three ones. the URL path for one of the API calls, the one that returns the tracks from specified ids, the parameters that will be used on each API call and the API KEY.</p>
        </main>
    )
}