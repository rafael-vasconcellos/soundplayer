"use client"
import React, { Component, RefObject } from 'react';
import Hls from 'hls.js';




interface AudioPlayerProps {
  src: string;
}


class AudioPlayer2 extends Component<AudioPlayerProps> { 
  private audioRef: RefObject<HTMLAudioElement>;
  constructor(props: AudioPlayerProps) {
    super(props);
    this.audioRef = React.createRef();
  }

  componentDidMount() { 
    const { src } = this.props;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(this.audioRef.current as HTMLMediaElement);
      /*hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.audioRef?.current?.play();
      });*/
    } else if (this.audioRef?.current?.canPlayType('application/vnd.apple.mpegurl')) {
      this.audioRef.current.src = src;
      /*this.audioRef.current.addEventListener('loadedmetadata', () => {
        this.audioRef?.current?.play();
      });*/
    } console.log(this.audioRef)
  }

  render() {
    return (
      <audio ref={this.audioRef} id="audioPlayer" autoPlay />
    );
  }
}


export default AudioPlayer2;



function App() {
  const audioUrl = '';

  return (
    <div>
      <h1>Reprodutor de Áudio HLS</h1>
      <AudioPlayer2 src={audioUrl} />
    </div>
  );
}




async function dada(str:string | undefined) {
  //const [ url, setUrl ] = useState<string | null>(null)

  if (str) {
      return await fetch('/api/track', { headers: { 
          "url": str
      } } )
      .then(response => response.text()).then(res => { 
          //setUrl(res)
      } )
  }
}


/*
    { 
        (fetched && url) && 
        <AudioPlayer3 src={url} />
        //<AudioPlayer2 src={url} /> 
    }
*/