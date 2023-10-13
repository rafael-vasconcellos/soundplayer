"use client"
import { IAPI } from "./API"
import AudioPlayer from "./AudioPlayer"
import { useEffect, useState } from "react"




export interface IPlayerProps { 
    api: IAPI
    
}

/*
    o uso da responsividade com javascript é necessário pois eu quero que o texto, 
    independente do tamanho da tela, caiba em uma linha.
*/

const sizesSchema = {
    screenH: 0,
    screenW: 0,
    get text() { return this.screenW * 0.03 },
    get button() { if (this.screenH <= 200 && this.screenH !== 0) { 
        return { height: this.screenH * 0.16 }
    } else { return {} }

    },

}


const Player: React.FC<IPlayerProps> = function( {api} ) { 
    const [ size, setSizes ] = useState(sizesSchema)


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
            <AudioPlayer api={api} /> 

            <div className='flex justify-center gap-5 px-6' id="controls">
                    <button className="rounded-full p-1 border-white" >
                        <svg xmlns="http://www.w3.org/2000/svg" style={size.button}
                         fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z" />
                        </svg>
                    </button>

                    <div>
                        <PlayButton size={size} />
                        <PauseButton size={size} />
                    </div>

                    <button className="rounded-full p-1 border-white">
                        <svg xmlns="http://www.w3.org/2000/svg" style={size.button}
                         fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" />
                        </svg>
                    </button>

            </div>
        </>
    )
}


export default Player



const PlayButton: React.FC<{size: typeof sizesSchema}> = function( {size} ) { 

    return (
        <button className="rounded-full p-1 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" style={size.button}
                fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
        </button>
    )
}


const PauseButton: React.FC<{size: typeof sizesSchema}> = function( {size} ) { 

    return (
        <button className="rounded-full p-1 hidden border-white">
                <svg xmlns="http://www.w3.org/2000/svg" style={size.button}
                fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                </svg>
        </button>
    )
}