import React, { useRef, useEffect, useState } from "react";
import "./App.css";
// import Video from "./videos/videoplayback.mp4";
import { FaPlay, FaPause } from "react-icons/fa";
import { BsArrowsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { BiVolumeMute, BiVolumeFull } from "react-icons/bi";
import { GrForwardTen, GrBackTen } from "react-icons/gr";
import { CgInpicture } from "react-icons/cg";
import { TbLayoutDistributeHorizontal } from "react-icons/tb";
import { SiSpeedtest } from "react-icons/si";

const App = () => {
  //State
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [muted, setMuted] = useState(true);

  //Ref
  const videoPlayer = useRef();
  const videoContainer = useRef();
  const progressBar = useRef();
  const animationRef = useRef();
  const volumeRef = useRef();

  useEffect(() => {
    const seconds = Math.floor(videoPlayer.current.duration);
    setDuration(seconds);

    progressBar.current.max = seconds;
  }, [videoPlayer?.current?.loadedmetadata, videoPlayer?.current?.readyState]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  //Play__Pause__Video
  const togglePlay = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      videoPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      videoPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const toggleVolume = () => {
    setMuted(!muted);
    videoPlayer.current.muted = muted;
  };

  const toggleFullscreen = () => {
    setFullScreen(!fullScreen);
    if (document.fullscreenElement == null) {
      videoContainer.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = videoPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    videoPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  const backwardTen = () => {
    progressBar.current.value = Number(progressBar.current.value - 10);
    changeRange();
  };

  const forwardTen = () => {
    progressBar.current.value = Number(progressBar.current.value) + Number(10);
    changeRange();
  };

  const pictureMode = () => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled) {
      videoPlayer.current.requestPictureInPicture();
    }
  };

  const speedToggle = () => {
    setShowSpeed(!showSpeed);
  };

  const handleSpeed = (e) => {
    const speed = e.target.value;
    videoPlayer.current.playbackRate = speed;
    setShowSpeed(!showSpeed);
  };

  const theaterMode = () => {
    setIsTheaterOpen(!isTheaterOpen);
    if (!isTheaterOpen) {
      videoContainer.current.style.width = "100%";
      videoContainer.current.style.maxWidth = "inherit";
      videoContainer.current.style.minHeight = "80vh";
      videoContainer.current.style.backgroundColor = "black";
      videoPlayer.current.style.width = "60%";
      videoPlayer.current.style.objectFit = "fill";
    } else {
      videoContainer.current.style.width = "50%";
      videoContainer.current.style.maxWidth = "1000px";
      videoContainer.current.style.minHeight = "inherit";
      videoPlayer.current.style.width = "100%";
      videoPlayer.current.style.objectFit = "contain";
    }
  };

  const changeVolume = () => {
    const volumeRange = volumeRef.current.value;
    videoPlayer.current.volume = volumeRange;
    videoPlayer.current.muted = volumeRef.current.value === 0;
  };

  // console.log(videoPlayer?.current?.seekable)

  return (
    <div>
      <div className='video-container' ref={videoContainer}>
        <div className='videos'>
          <video
            src='blob:https://animexninja-api.dhvitop1.repl.co/a82f4b77-b6f7-4ebd-9b47-a1ea4850d2f6'
            ref={videoPlayer}
            onClick={togglePlay}
          ></video>
        </div>

        <div className='controls'>
          <div className='player'>
            <button onClick={togglePlay}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
          </div>

          <div className='sound_mute'>
            <button onClick={toggleVolume}>
              {muted ? <BiVolumeFull /> : <BiVolumeMute />}
            </button>
            <div className='volume'>
              <input
                type='range'
                min={0}
                max={1}
                step={"any"}
                defaultValue={1}
                ref={volumeRef}
                onChange={changeVolume}
              />
            </div>
          </div>

          <p style={{ color: "white" }}>
            <span>{calculateTime(currentTime)}</span>

            <span>/</span>

            <span>
              {duration && !isNaN(duration) && calculateTime(duration)}
            </span>
          </p>

          <div className='controls-end'>
            <div className='forward_backward'>
              <GrBackTen onClick={backwardTen} />
              <GrForwardTen onClick={forwardTen} />
            </div>

            <div className='speed'>
              <SiSpeedtest onClick={speedToggle} />

              {showSpeed ? (
                <div className='speed-optios' onClick={(e) => handleSpeed(e)}>
                  <button value='0.75'>0.75x</button>
                  <button value='0.25'>0.25x</button>
                  <button value='0.5'>0.5x</button>
                  <button value='1'>Normal</button>
                  <button value='1.25'>1.25x</button>
                  <button value='1.5'>1.5x</button>
                  <button value='2'>2x</button>
                </div>
              ) : (
                ""
              )}
            </div>

            <div className='theater'>
              <TbLayoutDistributeHorizontal onClick={theaterMode} />
            </div>

            <div className='picture_in_picture'>
              <CgInpicture onClick={pictureMode} />
            </div>

            <div className='fullscreen'>
              <button onClick={toggleFullscreen}>
                {fullScreen ? <BsFullscreenExit /> : <BsArrowsFullscreen />}
              </button>
            </div>
          </div>
        </div>

        <div className='time-range'>
          <div className='progress-bar'>
            <input
              className='progressBar'
              type='range'
              name=''
              id=''
              defaultValue={0}
              ref={progressBar}
              onChange={changeRange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
