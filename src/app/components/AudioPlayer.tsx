"use client"
import { ChangeEvent, useEffect } from "react";
import { useHls, changePortrait, ITrack } from "../utils";
import { nextButton } from "./Buttons";



const audioHls = useHls()

export default function AudioPlayer( {tracks, currentSong}: {tracks: ITrack[], currentSong: number} ) { 

    useEffect( () => { 
        const playbutton = document.querySelector('#controls')?.children[1] as HTMLElement

        playbutton.addEventListener('click', async function() { 
            const isFetched = tracks.some(e => e.started)
            if (!isFetched) { //console.log('dada')
                await audioHls.fetch(tracks[currentSong]).then(() => playbutton.onclick = null)
            }
        } )

    }, [] )

    useEffect( () => { 
        const isFetched = tracks.some(e => e.started)
        tracks[currentSong]?.hls?.detachMedia()
        if (isFetched) { 
            audioHls.fetch(tracks[currentSong]).then(() => { audioHls.audioRef.current?.play() } )
        } 

    }, [currentSong] )



    return ( 
        <>

            <audio ref={audioHls.audioRef} id="audioPlayer"
            onTimeUpdate={ () => { 
                const slider: HTMLInputElement | null = document.querySelector('#playerRange')
                if (slider) {
                    slider.value = audioHls.audioRef.current?.currentTime.toString() ?? '0'
                }
            } } onLoadedMetadata={ () => { console.log('music loaded')
                const slider: HTMLInputElement | null = document.querySelector('#playerRange')
                if (!Number.isNaN(audioHls.audioRef.current?.duration)) { 
                    if (slider && audioHls.audioRef.current) { 
                        slider.max = audioHls.audioRef.current.duration.toString()
                    }
                }

                const track = tracks[currentSong]
                changePortrait(track, currentSong+1, tracks.length)
            } } onEnded={ () => { 
                nextButton.current?.click()
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




/*

*/