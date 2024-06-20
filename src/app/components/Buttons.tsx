import React, { Dispatch, RefObject, SetStateAction } from "react";


interface IButtonsProps { 
    screenW: number
    screenH: number
    text: number
    button: {
        height: number;
    } | {
        height?: undefined;
    }
}



export const nextButton = React.createRef<HTMLButtonElement>()

export default function Buttons( {size, totalTracks, setCurrentSong}: {size: IButtonsProps, totalTracks: number, setCurrentSong: Dispatch<SetStateAction<number>>} ) { 
    function toNext() { 
        setCurrentSong((prevSong) => { 
            if (prevSong >= totalTracks-1) { return 0 }
            else { return prevSong += 1 }
        } )
    }

    function toPrevious() { 
        setCurrentSong((prevSong) => {
            if (prevSong === 0) { return totalTracks-1 }
            else { return prevSong -= 1 }
        } )
    }

    return ( 
        <>
            <div className='flex justify-center gap-5 px-6' id="controls">
                    <button className="rounded-full p-1 border-white" onClick={toPrevious}>
                        <svg xmlns="http://www.w3.org/2000/svg" style={size.button}
                         fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z" />
                        </svg>
                    </button>

                    <PlaySwitch size={size} />

                    <button className="rounded-full p-1 border-white" ref={nextButton} onClick={toNext}>
                        <svg xmlns="http://www.w3.org/2000/svg" style={size.button}
                         fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" />
                        </svg>
                    </button>

            </div>
        </>
    )
}



function PlaySwitch( {size}: {size: IButtonsProps} ) { 
    const buttonRef: React.RefObject<HTMLButtonElement> = React.createRef()
    function play_handler() { 
        const audio = document.querySelector('#audioPlayer') as HTMLAudioElement
        if (audio?.paused) { audio?.play() } 
        else { audio?.pause() }
        buttonRef.current?.children[0]?.classList.toggle('hidden')
        buttonRef.current?.children[1]?.classList.toggle('hidden')
    }


    return(
        <button className="rounded-full p-1 border-white" ref={buttonRef} onClick={play_handler}>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" style={size.button}
                fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
            </div>
            <div className="hidden">
                <svg xmlns="http://www.w3.org/2000/svg" style={size.button}
                fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                </svg>
            </div>
        </button>
    )
}