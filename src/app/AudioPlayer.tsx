"use client"
import { ChangeEvent, useEffect, useState } from "react";
import Hls from "hls.js";
import { useHls, changePortrait, hydrateControls } from "./utils";
import { ICustomTrack } from "./IAPI";
import { IPlayerProps } from "./Player";




type ITrackRef = { 
    hls?: Hls
}

type ITrack = ICustomTrack & ITrackRef


export const audioHls = useHls()

const AudioPlayer: React.FC<IPlayerProps> = function( {api} ) { 
    const [ tracks ] = useState<ITrack[]>(api.data.tracks)
    const [ current_song, setCurrentSong ] = useState(0)

    function start() { return new Promise( (resolve) => {
        const track: ITrack = tracks[current_song]

        if (!track.hls && track.media?.transcodings[0]?.url) { 
            track.started = true
            fetch('/api/track/hls', { headers: {
                "url": track.media?.transcodings[0]?.url
            } } )
            .then(response => response.text()).then(url => { 
                const hls = audioHls.update(url)
                //track.hls = hls // essa linha comentada desativa o cache hls, caso não se mostrar viável
                resolve(1)
            } );

        } else if (track.hls && audioHls.audioRef.current) { 
            track.hls.attachMedia(audioHls.audioRef.current)
            resolve(1)
        }


    } ) }

    
    useEffect( () => { 
        const fetched = tracks.some(e => e.started)
        const playbutton = document.querySelector('#controls')?.children[1] as HTMLElement

        if (!playbutton.onmouseenter && !fetched) { 
            playbutton.onmouseenter = function() { if (!fetched) { 
                start().then(() => playbutton.onmouseenter = null) 
                hydrateControls(setCurrentSong, tracks.length)

            } }
        }


    }, [] )

    useEffect( () => { 
        const fetched = tracks.some(e => e.started)
        tracks[current_song]?.hls?.detachMedia()
        if (fetched) { 
            start().then(() => { audioHls.audioRef.current?.play() } )
        } 

    }, [current_song] )



    return ( 
        <>

            <audio ref={audioHls.audioRef} id="audioPlayer"
            onTimeUpdate={ () => {
                const slider: HTMLInputElement | null = document.querySelector('#playerRange')
                if (slider) {
                    slider.value = audioHls.audioRef.current?.currentTime.toString() ?? '0'
                }
            } } onLoadedMetadata={ () => { 
                const slider: HTMLInputElement | null = document.querySelector('#playerRange')
                if (!Number.isNaN(audioHls.audioRef.current?.duration)) { 
                    if (slider && audioHls.audioRef.current) { 
                        slider.max = audioHls.audioRef.current.duration.toString()
                        audioHls.audioRef.current.currentTime = 0
                    }
                }
            } } onEnded={ () => { 
                const playerParent = document.querySelector('#playerRange')?.nextElementSibling
                const nextbutton = playerParent?.children[2] as HTMLElement
                nextbutton.dispatchEvent(new Event('click'))
            } } onPlay={ () => { 
                const track = tracks[current_song]
                if (!audioHls.audioRef.current?.currentTime) { changePortrait(track, current_song+1, tracks.length) }
            } }></audio>
            {/* se colocar "autoPlay" a música vai ser tocada automáticamente (sem interação) sim */}


            <input className="w-4/5" id="playerRange" type="range" min={0} step="1" value={0} 
            onInput={ (e: ChangeEvent<HTMLInputElement>) => { 
                if (audioHls.audioRef.current?.currentTime) {
                    audioHls.audioRef.current.currentTime = Number(e.target.value)
                }
            } } />

        </>
    )
}


export default AudioPlayer;

/*

*/