// https://hlsjs.video-dev.org/api-docs/hls.js
import React, { RefObject } from 'react';
import Hls, { Events, ErrorData, ErrorController, ErrorDetails } from 'hls.js';
import { audioHls } from './components/AudioPlayer';
import { ICustomTrack } from './API';


export interface IUseHls { 
    check(): void

    audioRef: RefObject<HTMLAudioElement>
    track?: ICustomTrack
    streamUrl?: string
    fetch(track: ITrack): Promise<string | undefined>
    update(url: string): Hls
    load(): Hls
}

type ITrackRef = { 
    hls?: Hls
}


export type ITrack = ICustomTrack & ITrackRef
type ICurrentSongCallback = (prevSong: number) => number
type ISetCurrentSong = (callback: ICurrentSongCallback) => any





export function useHls(streamUrl?: string) { 
    const audioRef: IUseHls['audioRef'] = React.createRef()

    const AudioHls: IUseHls = { 
        streamUrl,
        track: undefined,
        get audioRef() { 
            return audioRef
        },

        async fetch(track: ITrack): Promise<string | undefined> { 
            this.track = track
            if (!track.hls && track.media?.transcodings[0]?.url) { 
                    track.started = true
                    return await fetch(`/api/track/hls/${track.id}`, { headers: { 
                        "url": track.media?.transcodings[0]?.url
                    } } )
                    .then(response => { 
                        if (response.status===200) { return response.text() }

                    }).then(url => { if (url) { 
                        const hls = this.update(url)
                        return url    
                    } } );
    

            } else if (track.hls && this.audioRef.current) { 
                console.log('alert')
                track.hls.attachMedia(this.audioRef.current)
                return this.streamUrl
            }
    
    
        },

        update(url: string) { 
            this.streamUrl = url
            return this.load()
        },

        load() { 
            const hls = new Hls();
            if (Hls.isSupported() && this.streamUrl) { 
                hls.loadSource(this.streamUrl);
                hls.attachMedia(audioRef.current as HTMLMediaElement);
            } else if (audioRef?.current?.canPlayType('application/vnd.apple.mpegurl') && this.streamUrl) { console.log('alert')
                audioRef.current.src = this.streamUrl;
            }

            /*audioRef.current?.addEventListener('loadedmetadata', () => {
                audioRef?.current?.play();
            } );*/

            if ( !hls.listeners(Events.ERROR)?.includes(handler) ) { hls.on(Events.ERROR, handler) }


            function handler(event: Events.ERROR, data: ErrorData) { 
                if ( // networkDetails
                    AudioHls.track && data.type === "networkError" 
                    && data.details === "fragLoadError" && data.response?.code === 403
                ) { 

                    const currentTime = hls.media?.currentTime
                    // hls.media?.currentTime, audioRef.current?.currentTime
                    hls.removeAllListeners()
                    AudioHls.fetch(AudioHls.track).then(url => { if (url && audioRef.current && currentTime) { 
                        audioRef.current.currentTime = currentTime
                        audioRef.current.play()
                    } } )
                }
            }

            return hls
        },

        check() {  }
    }


    return AudioHls
}


export function changePortrait(track: ICustomTrack, index: number, length: number) { 
    const artwork = track.updated_artwork ?? track.artwork_url?.replace("large", 't500x500')
    const title = track.title

    const img = document.querySelector('img') as HTMLImageElement
    const h1 = document.querySelector('main a#title') as HTMLElement
    const span = document.querySelector('p > span') as HTMLElement

    if (artwork) { img.src = artwork }
    h1.textContent = title?.slice(0, 24)? title?.slice(0, 24)+'...' : ''
    span.textContent = index + ' / ' + length

}


export function hydrateControls(setCurrentSong: ISetCurrentSong, length: number) {
    const playerParent = document.querySelector('#controls')
    const playbutton = playerParent?.children[1] as HTMLElement
    const prevbutton = playerParent?.children[0] as HTMLElement
    const nextbutton = playerParent?.children[2] as HTMLElement


    nextbutton.addEventListener('click',  function() { 
        setCurrentSong((prevSong) => { 
            if (prevSong >= length-1) { return 0 }
            else { return prevSong += 1 }
        } )
    } )

    prevbutton.addEventListener('click',  function() { 
        setCurrentSong((prevSong) => {
            if (prevSong === 0) { return length-1 }
            else { return prevSong -= 1 }
        } )
    } )

    playbutton.addEventListener('click', play_handler)

    function play_handler() {
        if (audioHls.audioRef.current?.paused) { audioHls.audioRef.current?.play() } 
        else { audioHls.audioRef.current?.pause() }
        playbutton?.children[0]?.classList.toggle('hidden')
        playbutton?.children[1]?.classList.toggle('hidden')
    }

    play_handler()

}








/*

function start(track: ITrack, audioHls: IUseHls): Promise<string | undefined> { return new Promise( (resolve) => {
        if (!track.hls && track.media?.transcodings[0]?.url) { 
            track.started = true
            fetch('/api/track/hls', { headers: {
                "url": track.media?.transcodings[0]?.url
            } } )
            .then(response => response.text()).then(url => { 
                const hls = audioHls.update(url)
                //track.hls = { ...hls } // essa linha comentada desativa o cache hls, caso não se mostrar viável
                resolve(url)
            } );

        } else if (track.hls && audioHls.audioRef.current) { 
            track.hls.attachMedia(audioHls.audioRef.current)
            resolve(audioHls.url)
        }


    } ) }


*/