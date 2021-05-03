import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  IconButton,
  List,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ShareIcon from "@material-ui/icons/Share";
import { red } from "@material-ui/core/colors";
import CommentIcon from "@material-ui/icons/Comment";
import axios from "axios";
import { useCookies } from "react-cookie";
import { getById } from "../../utils/general";

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    marginBottom: 20,
  },
  image: {
    minWidth: 150,
  },
  card: {
    display: "flex",
    marginBottom: 20,
  },
}));

function FeedItem({ feed, profile }) {
  const classes = useStyles();
  const [likesCount, setLikesCount] = useState(0);
  const [cookie, removeCookie] = useCookies(["user"]);
  const [userLiked, setUserLiked] = useState(false);
  useEffect(() => {
    axios
      .get(`/api/likes/${feed.id}`, {
        headers: { Authorization: `Bearer ${cookie.user.token}` },
      })
      .then(({ data }) => {
        setLikesCount(data.length);
        data.map((like) => {
          if (profile.id == like.userId) {
            setUserLiked(true);
          }
        });
      })
      .catch((err) => {
        alert("Failed to fetch feeds");
      });
  }, []);
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.image}
        image="/beach.jpg"
        title="Profile Image"
      />
      <CardContent className={classes.content}>
        <Typography variant="h5">{feed?.createdBy}</Typography>
        <Typography variant="body1">{feed?.message}</Typography>
        <IconButton aria-label="like">
          {userLiked ? (
            <React.Fragment>
              <FavoriteIcon color="secondary" /> {likesCount}
            </React.Fragment>
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>

        <IconButton aria-label="like">
          <CommentIcon />
        </IconButton>
      </CardContent>
      {/* <CardActions>
        <IconButton aria-label="like">
          <FavoriteIcon />
        </IconButton>
      </CardActions> */}
    </Card>
  );
}

export default FeedItem;
