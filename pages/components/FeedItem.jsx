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
import { connect } from "react-redux";
import { setUserProfile } from "../../redux/actions/userProfileActions";
import { setFeeds } from "../../redux/actions/feeds";
import DeleteIcon from "@material-ui/icons/Delete";

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

function FeedItem({ feed, userProfile, setUserProfile }) {
  const classes = useStyles();
  const [likesCount, setLikesCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [cookie, removeCookie] = useCookies(["user"]);
  let cretedBy;
  useEffect(() => {
    let count = 0;
    userProfile.likes.map((like) => {
      if (feed.id === like.feedId) {
        count++;
      }
    });
    setLikesCount(count);
  }, []);

  useEffect(() => {
    userProfile.likes.map((like) => {
      if (like.userId === userProfile.id) {
        setUserLiked(true);
      }
    });
  }, [userProfile]);

  const handleLike = () => {
    if (userLiked) {
      setUserLiked(false);
      setLikesCount(likesCount - 1);
      let likes = [];
      userProfile.likes.map((like) => {
        if (feed.id !== like.feedId) {
          likes.push(like);
        }
      });
      setUserProfile({ ...userProfile, likes: likes });
      axios
        .get(`/api/feeds/${feed.id}/unlike`, {
          headers: { Authorization: `Bearer ${cookie.user.token}` },
        })
        .then((resp) => {})
        .then((result) => {})
        .catch((err) => {
          alert("Something went wrong");
        });
    } else {
      setUserLiked(true);
      setLikesCount(likesCount + 1);
      let likes = userProfile.likes;
      likes.push({ feedId: feed.id, userId: feed.createdBy.id });
      setUserProfile({ ...userProfile, likes: likes });
      axios
        .get(`/api/feeds/${feed.id}/like`, {
          headers: { Authorization: `Bearer ${cookie.user.token}` },
        })
        .then((resp) => {})
        .then((result) => {})
        .catch((err) => {
          alert("Something went wrong");
        });
    }
  };
  const handleDeleteFeed = () => {
    axios
      .delete(`/api/feeds/${feed.id}`, {
        headers: { Authorization: `Bearer ${cookie.user.token}` },
      })
      .then((result) => {
        axios.get(`/api/feeds/${feed.id}/unlike`, {
          headers: { Authorization: `Bearer ${cookie.user.token}` },
        });
      })
      .catch((err) => {});
  };
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.image}
        image="/beach.jpg"
        title="Profile Image"
      />
      <CardContent className={classes.content}>
        <Typography variant="h5">{feed?.createdBy.name}</Typography>
        <Typography variant="body1">{feed?.message}</Typography>
        <IconButton aria-label="like" onClick={handleLike}>
          {userLiked ? (
            <React.Fragment>
              <FavoriteIcon color="secondary" />
            </React.Fragment>
          ) : (
            <FavoriteBorderIcon />
          )}
          <Typography variant="subtitle1" color="secondary">
            {likesCount}
          </Typography>
        </IconButton>
        <IconButton aria-label="like">
          <CommentIcon />
        </IconButton>
        <IconButton aria-label="like" onClick={handleDeleteFeed}>
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
}

function mapStateToProps(state) {
  return { feeds: state.feeds, userProfile: state.userProfile };
}

function mapDispatchToProps(dispatch) {
  return {
    setFeeds: (feeds) => dispatch(setFeeds(feeds)),
    setUserProfile: (profile) => dispatch(setUserProfile(profile)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedItem);

// export default FeedItem;
