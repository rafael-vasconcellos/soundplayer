import React, { RefObject } from 'react';
import Hls from 'hls.js';
import { audioHls } from './AudioPlayer';
import { ICustomTrack } from './IAPI';


export interface IUseHls { 
    check(): void
    audioRef: RefObject<HTMLAudioElement>
    load(): Hls
    update(url: string): Hls
    url: string | undefined
}

type ICurrentSongCallback = (prevSong: number) => number
type ISetCurrentSong = (callback: ICurrentSongCallback) => any





export function useHls(url?: string) { 
    const audioRef: IUseHls['audioRef'] = React.createRef()

    const AudioHls: IUseHls = { 
        url: url,
        
        get audioRef() { 
            return audioRef
        },

        load() { 
            const hls = new Hls();
            if (Hls.isSupported() && this.url) { 
                hls.loadSource(this.url);
                hls.attachMedia(audioRef.current as HTMLMediaElement);
                /*hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    audioRef?.current?.play();
                } );*/
            } else if (audioRef?.current?.canPlayType('application/vnd.apple.mpegurl')) { 
                if (this.url) {
                    audioRef.current.src = this.url;
                }

                /*audioRef.current.addEventListener('loadedmetadata', () => {
                    audioRef?.current?.play();
                } );*/
            }

            return hls
        },

        update(url) { 
            this.url = url
            return this.load()
        },

        check() { console.log('') }
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

    playbutton.addEventListener('click', () => { 
        if (audioHls.audioRef.current?.paused) { audioHls.audioRef.current?.play() } 
        else { audioHls.audioRef.current?.pause() }
        playbutton.children[0]?.classList.toggle('hidden')
        playbutton.children[1]?.classList.toggle('hidden')
    } )

}