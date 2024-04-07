"use client"
import { ChangeEvent, useEffect, useState } from "react";
import { useHls, changePortrait, hydrateControls, ITrack } from "../utils";
import { IPlayerProps } from "./Player";




export const audioHls = useHls()

const AudioPlayer: React.FC<IPlayerProps> = function( {api} ) { 
    const tracks: ITrack[] = api.data.tracks
    const [ current_song, setCurrentSong ] = useState(0)


    useEffect( () => { 
        const fetched = tracks.some(e => e.started)
        const playbutton = document.querySelector('#controls')?.children[1] as HTMLElement

        playbutton.onclick = async function() { if (!fetched) { 
            await audioHls.fetch(tracks[current_song]).then(() => playbutton.onclick = null) 
            hydrateControls(setCurrentSong, tracks.length)
        } }

    }, [] )

    useEffect( () => { 
        const fetched = tracks.some(e => e.started)
        tracks[current_song]?.hls?.detachMedia()
        if (fetched) { 
            audioHls.fetch(tracks[current_song]).then(() => { audioHls.audioRef.current?.play() } )
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
            } } onLoadedMetadata={ () => { console.log('loaded')
                const slider: HTMLInputElement | null = document.querySelector('#playerRange')
                if (!Number.isNaN(audioHls.audioRef.current?.duration)) { 
                    if (slider && audioHls.audioRef.current) { 
                        slider.max = audioHls.audioRef.current.duration.toString()
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