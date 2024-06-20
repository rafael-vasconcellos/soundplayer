// https://hlsjs.video-dev.org/api-docs/hls.js
import React, { RefObject } from 'react';
import Hls, { Events, ErrorData, ErrorController, ErrorDetails } from 'hls.js';
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





const audioRef: IUseHls['audioRef'] = React.createRef()

export function useHls(streamUrl?: string) { 

    const AudioHls: IUseHls = { 
        streamUrl,
        track: undefined,
        get audioRef() { return audioRef },

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
                    && data.details === "fragLoadError" && (data.response?.code ?? 0) === 403
                ) { 

                    const currentTime = hls.media?.currentTime
                    // hls.media?.currentTime, audioRef.current?.currentTime
                    hls.removeAllListeners()
                    AudioHls.fetch(AudioHls.track).then(url => { 
                        if (url && audioRef.current && currentTime) { 
                            audioRef.current.currentTime = currentTime
                            audioRef.current.play()
                        } 
                    } )
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
    const h1 = document.querySelector('main a#title') as HTMLAnchorElement
    const span = document.querySelector('p > span') as HTMLElement

    if (artwork) { img.src = artwork } else { console.log(track) }
    let string = title? title : ''
    if(string.length >= 24) { string = string.slice(0, 24)+'...' }

    h1.textContent = string
    h1.href = track.permalink_url ?? ""
    span.textContent = index + ' / ' + length

}



