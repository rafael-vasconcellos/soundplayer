"use client"
import { useEffect } from 'react';
import { useHls } from '../utils'; // Certifique-se de importar o hook corretamente

const AudioPlayer3: React.FC<{src: string}> = function( {src} ) { 
  const { audioRef, check } = useHls(src); // Substitua 'URL_DO_SEU_ARQUIVO_M3U8' pela URL da sua transmissão HLS

  // Função para reproduzir o áudio
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  // Função para pausar o áudio
  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  useEffect( () => { 
      check()
  }, [audioRef] )

  return (
    <>
      <audio ref={audioRef} id="audioPlayer" autoPlay />
    </>
  );
}

export default AudioPlayer3;
