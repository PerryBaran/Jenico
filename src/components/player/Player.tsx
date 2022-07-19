import React, { useState, useEffect, Dispatch, SetStateAction, useRef } from 'react';
import style from './player.module.css';
import { SongInfo } from '../../Interface';
import Audio from './audio/Audio';
import Info from './info/Info';
import ProgresssBar from './progressbar/ProgresssBar';
import Time from './time/Time';
import MediaControls from './mediaControls/MediaControls';
import Volume from './volume/Volume';
import Tracklist from './tracklist/Tracklist';

function Player(props: {data: SongInfo[], playing: boolean, setPlaying: Dispatch<SetStateAction<boolean>>, songIndex: number, setSongIndex: Dispatch<SetStateAction<number>>, albumIndex: number, setAlbumIndex: Dispatch<SetStateAction<number>>}) {
    const {data, playing, setPlaying, songIndex, setSongIndex, albumIndex, setAlbumIndex} = props;
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const barRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const updateTimer = setInterval(() => {
            if (audioRef.current) {
                const seconds = Math.round(audioRef.current.currentTime)
                setTime(seconds)
            }    
        }, 250);
        return () => clearInterval(updateTimer);
    }, [time]);

    const skipSong = (forwards = true) => {
        const albumLength = data[albumIndex].songs.length;
        const playlistLength = data.length;
        if (forwards) {
            const tempSongIndex = songIndex + 1;
            if (tempSongIndex >= albumLength) {
                let tempAlbumIndex = albumIndex + 1;
                if (tempAlbumIndex >= playlistLength) {
                    setAlbumIndex(0);
                    setSongIndex(0);
                    return;
                } else {
                    setAlbumIndex(tempAlbumIndex)
                    setSongIndex(0);
                    return;
                }
            } else {
                setSongIndex(tempSongIndex);
                return;
            }
        } else {
            const tempSongIndex = songIndex - 1;
            if (tempSongIndex < 0) {
                let tempAlbumIndex = albumIndex - 1;
                if (tempAlbumIndex < 0) {
                    setAlbumIndex(playlistLength - 1);
                    setSongIndex(data[playlistLength - 1].songs.length - 1);
                    return;
                } else {
                    setAlbumIndex(tempAlbumIndex);
                    setSongIndex(data[albumIndex - 1].songs.length - 1);
                    return;
                }
            } else {
                setSongIndex(tempSongIndex);
                return;
            }
        }
    };

    return (
        <section className={style.container}>
            <Audio 
                data={data}
                playing={playing}
                songIndex={songIndex}
                albumIndex={albumIndex}
                audioRef={audioRef}
                setDuration={setDuration}
                skipSong={skipSong}/>
            <Info 
                data={data}
                songIndex={songIndex}
                albumIndex={albumIndex}/>
            <div className={style.center}>
                <ProgresssBar 
                    barRef={barRef}
                    audioRef={audioRef}
                    time={time}
                    duration={duration}/>
                <div className={style.belowBar}>
                    <Time time={time}/>
                    <MediaControls 
                        playing={playing}
                        setPlaying={setPlaying}
                        skipSong={skipSong}/>
                    <Time time={duration}/>
                </div>
            </div>
            <Volume 
                audioRef={audioRef}/>
            <Tracklist 
                data={data}
                songIndex={songIndex}
                setSongIndex={setSongIndex}
                albumIndex={albumIndex}
                setAlbumIndex={setAlbumIndex}
                setPlaying={setPlaying}/>
            
        </section>
    );
}

export default Player;