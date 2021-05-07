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
import CommentItem from "./CommentItem";

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

const FeedDialog = ({
  onClose,
  open,
  feed,
  feedComments,
  setFeedComments,
  handleUserLike,
  userLiked,
  likesCount,
  commentsCount,
  handleDeleteFeed,
  feeds,
  userProfile,
  setFeeds,
}) => {
  const classes = useStyles();
  const { register, handleSubmit, control, reset } = useForm();
  const [comments, setComments] = useState(feed.comments);
  const [cookie, removeCookie] = useCookies(["user"]);
  const onComment = (data) => {
    const body = {
      message: data.comment,
    };
    axios
      .post(`/api/feeds/${feed.id}/comments`, body, {
        headers: { Authorization: `Bearer ${cookie.user.token}` },
      })
      .then((result) => {
        let newFeeds = feeds.map((curFeed) => {
          if (curFeed.id == feed.id) {
            return { ...curFeed, comments: [result.data, ...curFeed.comments] };
          } else {
            return curFeed;
          }
        });
        setFeeds([...newFeeds]);
        setFeedComments([result.data, ...feedComments]);
      })
      .catch((err) => {});

    reset();
  };
  return (
    <Container className={classes.container}>
      <Dialog
        onClose={onClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">Messages</DialogTitle>
        <DialogContent>
          <Card className={classes.card}>
            <CardMedia
              component="img"
              className={classes.image}
              image={userProfile.profilePic}
              height="100"
              title="ProfilePic"
              alt="pic"
            />
            <CardContent className={classes.content}>
              <Typography variant="h5">{feed?.createdBy.name}</Typography>
              <Typography variant="body1">{feed?.message}</Typography>
              <Button aria-label="like">
                {userLiked ? (
                  <React.Fragment>
                    <FavoriteIcon
                      color="secondary"
                      onClick={() => handleUserLike(false)}
                    />
                  </React.Fragment>
                ) : (
                  <FavoriteBorderIcon onClick={() => handleUserLike(true)} />
                )}
                <Typography variant="subtitle1" color="secondary">
                  {likesCount}
                </Typography>
              </Button>
              {feed?.createdBy.id === userProfile.id && (
                <Button aria-label="like" onClick={handleDeleteFeed}>
                  <DeleteIcon />
                </Button>
              )}
            </CardContent>
          </Card>
          <br />
          <form onSubmit={handleSubmit(onComment)}>
            <TextField
              label="Enter comment"
              {...register("comment", {
                required: "Required",
              })}
              rows={2}
              fullWidth
              multiline
            />
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </form>
          {feed.comments.map((comment, index) => {
            return <CommentItem key={index} comment={comment} feed={feed} />;
          })}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(FeedDialog);
