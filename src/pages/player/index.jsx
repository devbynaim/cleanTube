import Footer from "../../components/Footer";
import Header from "../../components/Header";
import styled from "styled-components";
import YouTube from "react-youtube";
import VideoCard from "../../components/shared/VideoCard";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import usePlaylist from "../../hooks/usePlaylist";
import Note from "../../components/Note";
import PlayerSkeleton from "./PlayerSkeleton";
import { formatTime } from "../../utils/formatTime";

const HomeWrapper = styled.div`
  flex-direction: column;
  display: flex;
  height: 100vh;
`;

const Main = styled.main`
  max-width: 1420px;
`;
const MainWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 5px;
  overflow: hidden;
  margin: 15px 0;
  background-color: white;
  @media screen and (max-width: 850px) {
    flex-direction: column;
  }
`;
const LeftSide = styled.div`
  width: 100%;
  overflow: hidden;
`;

const VideoPlayerContainer = styled.div`
  max-height: 560px;
  height: 35vw;
  width: 100%;
  overflow: hidden;

  /* @media screen and (max-width: 1250px) {
    height: 34vw;
  } */
  @media screen and (max-width: 1425px) {
    height: 34vw;
  }
  @media screen and (max-width: 1152px) {
    height: 34vw;
  }
  @media screen and (max-width: 1066px) {
    height: 33vw;
  }
  @media screen and (max-width: 980px) {
    height: 32vw;
  }
  @media screen and (max-width: 880px) {
    height: 30vw;
  }
  @media screen and (max-width: 850px) {
    height: 55vw;
  }
  @media screen and (max-width: 702px) {
    height: 56vw;
  }
`;
const VideoContainer = styled.div`
  width: 97%;
  margin: auto;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RightSide = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: scroll;
  transition: scroll-behavior 3s ease-in-out;
`;

const Title = styled.a`
  font-size: 16px;
  font-weight: bold;
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 5px;
`;
const ActionBtn = styled.button`
  font-size: 15px;
  font-weight: bold;
  width: 100%;
  background-color: ${({ active }) => (active ? "#F2F2F2" : "white")};
  height: 35px;
  border-radius: 2px;
  box-shadow: none;
  transition: all 0.5s;
  &:hover {
    cursor: pointer;
    background-color: #f2f2f2;
  }
`;
const Description = styled.p`
  display: block;
  font-size: 14px;
  overflow: auto;
`;

const Player = () => {
  const [isNote, setIsNote] = useState(false);
  const [isShowMore, setIshowMore] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoTime,setVideoTime] = useState(0)
  const location = useLocation();
  const params = new URL(`https://www.youtube.com/${location.search}`)
    .searchParams;
  const playlistId = params.get("list");
  const running = params.get("running");
  const { getVideos, playlists } = usePlaylist();
  const { channelTitle, items } = getVideos(playlistId);
  const [runningVideo, setRuningVideo] = useState();

  useEffect(() => {
    setRuningVideo(items[running]);
  }, [running, playlists]);

  const opts = {
    playerVars: {
      autoplay: 0,
    },
  };

  const toggle = (action) => {
    setIsNote(action);
  };

  const onVideoReady = (event) => {
    setIsVideoLoaded(true);
  };
  const handelShowMore = (isShow) => {
    setIshowMore(isShow);
  };

  const handelVideoTimeLine = (e)=>{
    setVideoTime(formatTime(e.target.getCurrentTime()))
  }
  return (
    <HomeWrapper>
      <Header />
      <Main className="container">
        <MainWrapper>
          <LeftSide>
            {runningVideo && (
              <VideoPlayerContainer>
                <YouTube
                  videoId={runningVideo.videoId}
                  opts={opts}
                  style={{ width: "100%", height: "100%" }}
                  loading="lazy"
                  onReady={onVideoReady}
                  onStateChange= {handelVideoTimeLine}
                />
                {!isVideoLoaded && <PlayerSkeleton />}
              </VideoPlayerContainer>
            )}
            <VideoContainer>
              <Title>{runningVideo && runningVideo.title}</Title>
              <ActionContainer>
                <ActionBtn active={!isNote} onClick={() => toggle(false)}>
                  Description
                </ActionBtn>
                <ActionBtn active={isNote} onClick={() => toggle(true)}>
                  Notes
                </ActionBtn>
              </ActionContainer>
              {!isNote && (
                <Description>
                  {!isShowMore ? (
                    <div>
                      {runningVideo &&
                        runningVideo.description.substring(1, 100)}
                      <button
                        style={{ marginLeft: "10px" }}
                        onClick={() => handelShowMore(true)}
                      >
                        Show more
                      </button>
                    </div>
                  ) : (
                    <div>
                      {runningVideo && runningVideo.description}
                      <button
                        style={{ marginLeft: "10px" }}
                        onClick={() => handelShowMore(false)}
                      >
                        hide
                      </button>
                    </div>
                  )}
                </Description>
              )}
              {isNote && <>{running&&<Note videoId={runningVideo.videoId} timeline={videoTime}/>}</>}
            </VideoContainer>
          </LeftSide>
          <RightSide>
            {items.map(({ thumbnail, title, videoId, position }, index) => {
              return (
                <VideoCard
                  thumbnail={thumbnail}
                  title={title}
                  channelTitle={channelTitle}
                  active={index == running}
                  key={videoId}
                  position={position}
                  playlistId={playlistId}
                />
              );
            })}
          </RightSide>
        </MainWrapper>
      </Main>
      <Footer />
    </HomeWrapper>
  );
};

export default Player;
