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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ShareIcon from "@material-ui/icons/Share";
import { red } from "@material-ui/core/colors";
import axios from "axios";
import { useCookies } from "react-cookie";
import { getById } from "../../utils/general";
import { connect } from "react-redux";
import { setUserProfile } from "../../redux/actions/userProfileActions";
import { setFeeds } from "../../redux/actions/feeds";
import { useRouter } from "next/router";
import CustomLink from "../../src/CustomLink";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import CommentIcon from "@material-ui/icons/Comment";
import DeleteIcon from "@material-ui/icons/Delete";
import { useForm } from "react-hook-form";
import likes from "../api/feeds/[feedId]/likes";
import FeedDialog from "./FeedDialog";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    marginTop: 20,
  },
  image: { height: 140, width: 100 },
  container: {
    display: "flex",
    justifyContent: "center",
    maxWidth: 400,
  },
  cardAvatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

function FeedItem({
  feed,
  userProfile,
  setUserProfile,
  feeds,
  setFeeds,
  comments,
}) {
  const classes = useStyles();
  const [likesCount, setLikesCount] = useState(feed?.likes.length);
  const [commentsCount, setCommentsCount] = useState(feed?.comments.length);
  const [feedComments, setFeedComments] = useState(feed?.comments);
  let [userLiked, setUserLiked] = useState(false);
  const [cookie, removeCookie] = useCookies(["user"]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [feedProfile, setFeedProfile] = useState({});

  useEffect(() => {
    setUserLiked(feed?.likes.includes(userProfile.id));
  }, [userProfile]);

  useEffect(() => {
    feeds.map((curFeed) => {
      if (curFeed.id == feed.id) {
        setLikesCount(curFeed?.likes.length);
        setFeedComments(curFeed?.comments);
        setCommentsCount(curFeed?.comments.length);
      }
    });
  }, [feeds]);

  const handleUserLike = (like) => {
    if (like) {
      axios
        .get(`/api/feeds/${feed.id}/like`, {
          headers: { Authorization: `Bearer ${cookie.user.token}` },
        })
        .then((result) => {
          if (result.status == 200) {
            setUserLiked(true);
            let newFeeds = feeds.map((curFeed) => {
              if (curFeed.id == feed.id) {
                setLikesCount(curFeed?.likes.length + 1);
                return {
                  ...curFeed,
                  likes: [...curFeed?.likes, userProfile.id],
                };
              } else {
                return curFeed;
              }
            });
            setFeeds([...newFeeds]);
            feed = { ...feed, likes: [...feed?.likes, userProfile.id] };
          } else {
            console.log("result is not ok", result);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(`/api/feeds/${feed.id}/unlike`, {
          headers: { Authorization: `Bearer ${cookie.user.token}` },
        })
        .then((result) => {
          if (result.status == 200) {
            setUserLiked(like);
            let newFeeds = feeds.map((curFeed) => {
              if (curFeed.id == feed.id) {
                let likes = curFeed?.likes;
                let index = likes.findIndex((id) => id == userProfile.id);
                likes.splice(index, 1);
                setLikesCount(likes.length);
                return { ...curFeed, likes: likes };
              } else {
                return curFeed;
              }
            });
            setFeeds([...newFeeds]);
          } else {
            console.log("result is no ok", result);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDeleteFeed = () => {
    axios
      .delete(`/api/feeds/${feed?.id}`, {
        headers: { Authorization: `Bearer ${cookie.user.token}` },
      })
      .then((result) => {
        if (result.status == 200) {
          // Delete Comments
          feed?.comments.map((comment) => {
            axios.delete(`/api/comments/${comment.id}`, {
              headers: { Authorization: `Bearer ${cookie.user.token}` },
            });
          });
          // Delete Likes
          axios.get(`/api/feeds/${feed?.id}/unlike`, {
            headers: { Authorization: `Bearer ${cookie.user.token}` },
          });

          let index = feeds.findIndex((curFeed) => curFeed.id == feed?.id);
          feeds.splice(index, 1);
          setFeeds([...feeds]);
        } else {
          console.log("result is not ok", result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardMedia
          component="img"
          className={classes.image}
          image={feed?.profile.profilePic}
          height="100"
          title="ProfilePic"
          alt="pic"
        />
        <CardContent className={classes.content}>
          <Typography variant="h5">{feed?.createdBy.name}</Typography>
          <Typography variant="body1">{feed?.message}</Typography>
          <Button aria-label="like">
            {userLiked ? (
              <FavoriteIcon
                color="secondary"
                onClick={() => handleUserLike(false)}
              />
            ) : (
              <FavoriteBorderIcon onClick={() => handleUserLike(true)} />
            )}
            <Typography variant="subtitle1" color="secondary">
              {likesCount}
            </Typography>
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <CommentIcon /> {commentsCount}
          </Button>
          {feed?.createdBy.id === userProfile.id && (
            <Button aria-label="like" onClick={() => handleDeleteFeed()}>
              <DeleteIcon />
            </Button>
          )}
        </CardContent>
      </Card>
      <FeedDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        feed={feed}
        feedComments={feedComments}
        handleUserLike={handleUserLike}
        userLiked={userLiked}
        likesCount={likesCount}
        commentsCount={commentsCount}
        handleDeleteFeed={handleDeleteFeed}
        // userProfile={userProfile}
        setFeedComments={setFeedComments}
      />
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {
    feeds: state.feeds,
    userProfile: state.userProfile,
    comments: state.comments,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setFeeds: (feeds) => dispatch(setFeeds(feeds)),
    setUserProfile: (profile) => dispatch(setUserProfile(profile)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedItem);
