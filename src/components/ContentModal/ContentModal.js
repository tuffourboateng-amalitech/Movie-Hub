import React, { useState, useEffect } from "react";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import {
  img_500,
  unavailable,
  unavailableLandscape,
} from "../../config/config.js";
import Carousel from "../Carousel/Carousel";
import YouTubeIcon from '@mui/icons-material/YouTube';
import './ContentModal.css'
// import { spacing, shadows } from "@mui/system";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '90%',
  height:'80%',
  transform: 'translate(-50%, -50%)',
  color:"white",
  bgcolor: '#39445a',
  border: '2px solid #000',
  boxShadow: 15,
  p: 4,
  borderRadius:10

};
export default function ContentModal({ children, media_type, id }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState();
  const [video, setVideo] = useState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_MY_MOVIE_DB_API}&language=en-US`
    );

    setContent(data);
    // console.log(data);
  };

  const fetchVideo = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${process.env.REACT_APP_MY_MOVIE_DB_API}&language=en-US`
    );

    setVideo(data.results[0]?.key);
  };

  useEffect(() => {
    fetchData();
    fetchVideo();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div 
      className="media"
      style={{cursor:"pointer"}}
      color="inherit"
      onClick={handleOpen}
      >
        {children}
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          {content && (
            <Box sx={style}>
              <div className="ContentModal">
                <img
                  alt={content.name || content.title}
                  className="ContentModal__portrait"
                  src={
                    content.poster_path
                      ? `${img_500}/${content.poster_path}`
                      : unavailable
                  }
                />
                <img
                  alt={content.name || content.title}
                  className="ContentModal__landscape"
                  src={
                    content.backdrop_path
                      ? `${img_500}/${content.backdrop_path}`
                      : unavailableLandscape
                  }
                />

                <div className="ContentModall__about">
                  <span className="ContentModal__title">
                    {content.name || content.title} (
                    {(
                      content.first_air_date ||
                      content.release_date ||
                      "-----"
                    ).substring(0, 4)}
                    )
                  </span>
                  {content.tagline && (
                    <i className="tagline">{content.tagline}</i>
                  )}

                  <span className="ContentModal__description">
                    {content.overview}
                  </span>

                  <div>
                    <Carousel id={id} media_type={media_type} />
                  </div>

                  <Button
                    variant="contained"
                    startIcon={<YouTubeIcon />}
                    color="secondary"
                    target="__blank"
                    href={`https://www.youtube.com/watch?v=${video}`}
                  >
                    Watch the Trailer
                  </Button>
                </div>
              </div>
            </Box>
          )}
        </Fade>
      </Modal>
    </>
  );
}
