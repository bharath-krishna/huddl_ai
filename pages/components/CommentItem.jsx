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

function CommentItem({ userProfile, comment, feed, feeds, setFeeds }) {
  const classes = useStyles();
  const [commentLiked, setCommentLiked] = useState(false);
  const [commentLikesCount, setCommentLikesCount] = useState(0);
  const [cookie, removeCookie] = useCookies(["user"]);

  useEffect(() => {
    feed.comments.some((curComment) => {
      if (curComment.id == comment.id) {
        if (curComment.createdBy.id == userProfile.id) {
          setCommentLiked(true);
        } else {
          setCommentLiked(false);
        }
      }
    });
  }, [feeds]);

  const handleDeleteComment = (comment) => {
    axios
      .delete(`api/comments/${comment.id}`, {
        headers: { Authorization: `Bearer ${cookie.user.token}` },
      })
      .then((result) => {
        if (result.statusText == "OK") {
          let newFeeds = feeds.map((curFeed) => {
            if (curFeed.id == feed.id) {
              let comments = curFeed?.comments;
              let index = comments.findIndex(
                (curComment) => curComment.id == comment.id
              );
              comments.splice(index, 1);
              return { ...curFeed, comments: [...comments] };
            } else {
              return { ...curFeed };
            }
          });
          console.log(newFeeds === feeds, "newFeeds === feeds in CommentItem");
          setFeeds([...newFeeds]);
        }
      });
  };
  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardMedia
          component="img"
          className={classes.image}
          image={comment?.profile.profilePic}
          height="100"
          title="ProfilePic"
          alt="pic"
        />
        <CardContent className={classes.content}>
          <Typography variant="h5">{comment?.createdBy.name}</Typography>
          <Typography variant="body1">{comment?.message}</Typography>
          {/* <Button aria-label="like">
            {commentLiked ? (
              <React.Fragment>
                <FavoriteIcon
                  color="secondary"
                  onClick={() => handleUserLike(true)}
                />
              </React.Fragment>
            ) : (
              <FavoriteBorderIcon onClick={() => handleUserLike(false)} />
            )}
            <Typography variant="subtitle1" color="secondary">
              {commentLikesCount}
            </Typography>
          </Button> */}
          {comment?.createdBy.id === userProfile.id && (
            <Button
              aria-label="like"
              onClick={() => handleDeleteComment(comment)}
            >
              <DeleteIcon />
            </Button>
          )}
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {
    feeds: state.feeds,
    userProfile: state.userProfile,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setFeeds: (feeds) => dispatch(setFeeds(feeds)),
    setUserProfile: (profile) => dispatch(setUserProfile(profile)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentItem);
