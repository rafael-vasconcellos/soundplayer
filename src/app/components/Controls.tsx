"use client";
import { useEffect, useState } from "react";
import AudioPlayer from "./AudioPlayer";
import Buttons from "./Buttons";
import { ITrack } from "../utils";



/*
    o uso da responsividade com javascript é necessário pois eu quero que o texto, 
    independente do tamanho da tela, caiba em uma linha.
*/

const sizesSchema = { 
    screenH: 0,
    screenW: 0,
    get text() { return this.screenW * 0.03 },
    get button() { 
        if (this.screenH <= 200 && this.screenH !== 0) { 
            return { height: this.screenH * 0.16 }
        } else { return {} }
    },

}


export default function Controls( {tracks}: {tracks: ITrack[]} ) { 
    const [ current_song, setCurrentSong ] = useState(0)
    const [ size, setSizes ] = useState(sizesSchema)
    const track = tracks?.length? tracks[0] : null

    function reziseHandler() { 
        size.screenH = document.querySelector('main')?.offsetHeight ?? 0
        size.screenW = document.querySelector('main')?.offsetWidth ?? 0
        setSizes( {...size} )
    }

    useEffect( () => { 
        reziseHandler()
        window.onresize = reziseHandler
    }, [] )

    useEffect( () => { 
        const title = document.querySelector('main a#title') as HTMLElement
        title.style.fontSize = size.text + 'px'
    }, [size] )

    return ( 
        <>
            <a className="font-bold" id="title" href={track?.permalink_url} target="_blank">
                {track?.title?.slice(0, 24) + '...'}
            </a>
            <AudioPlayer tracks={tracks} currentSong={current_song} />
            <Buttons size={size} totalTracks={tracks.length} setCurrentSong={setCurrentSong} />
        </>
    )
}



