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
  image: {
    minWidth: 150,
  },
  container: {
    display: "flex",
    justifyContent: "center",
    maxWidth: 800,
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
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [feedComments, setFeedComments] = useState([]);
  const [userLiked, setUserLiked] = useState(false);
  const [cookie, removeCookie] = useCookies(["user"]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [feedProfile, setFeedProfile] = useState({});

  useEffect(() => {
    let count = 0;
    userProfile.likes.map((like) => {
      if (feed?.id === like.feedId) {
        count++;
      }
    });
    setLikesCount(count);
  }, []);

  useEffect(() => {
    let count = 0;
    let feedComments = comments.filter((comment) => comment.feedId === feed.id);
    setFeedComments(feedComments);
    setCommentsCount(feedComments.length);
    getById("profile", feed.createdBy.id).then((profile) => {
      setFeedProfile(profile);
    });
  }, [userProfile]);

  useEffect(() => {
    userProfile.likes.map((like) => {
      if (like.userId === userProfile?.id) {
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
        if (feed?.id !== like.feedId) {
          likes.push(like);
        }
      });
      setUserProfile({ ...userProfile, likes: likes });
      axios
        .get(`/api/feeds/${feed?.id}/unlike`, {
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
      likes.push({ feedId: feed?.id, userId: feed.createdBy?.id });
      setUserProfile({ ...userProfile, likes: likes });
      axios
        .get(`/api/feeds/${feed?.id}/like`, {
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
      .delete(`/api/feeds/${feed?.id}`, {
        headers: { Authorization: `Bearer ${cookie.user.token}` },
      })
      .then((result) => {
        axios.get(`/api/feeds/${feed?.id}/unlike`, {
          headers: { Authorization: `Bearer ${cookie.user.token}` },
        });

        let index = feeds.findIndex(
          (deletedFeed) => deletedfeed?.id === feed?.id
        );
        feeds.splice(index, 1);
        setFeeds(feeds);
      })
      .catch((err) => {});
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardMedia
          className={classes.image}
          image={feedProfile.profilePic}
          title="Profile Image"
        />
        {/* <Avatar className={classes.cardAvatar} src={userProfile.profilePic} /> */}
        <CardContent className={classes.content}>
          <Typography variant="h5">{feed?.createdBy.name}</Typography>
          <Typography variant="body1">{feed?.message}</Typography>
          <Button aria-label="like" onClick={handleLike}>
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
          </Button>
          {/* <Button component={CustomLink} href={`/feeds/${feed?.id}`}>
            <CommentIcon />
          </Button> */}
          <Button onClick={() => setDialogOpen(true)}>
            <CommentIcon /> {commentsCount}
          </Button>
          <Button aria-label="like" onClick={handleDeleteFeed}>
            <DeleteIcon />
          </Button>
        </CardContent>
      </Card>
      <FeedDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        feed={feed}
        feedComments={feedComments}
        handleLike={handleLike}
        userLiked={userLiked}
        likesCount={likesCount}
        commentsCount={commentsCount}
        handleDeleteFeed={handleDeleteFeed}
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

// export default FeedItem;

const FeedDialog = ({
  onClose,
  open,
  feed,
  feedComments,
  setFeedComments,
  handleLike,
  userLiked,
  likesCount,
  commentsCount,
  handleDeleteFeed,
}) => {
  const classes = useStyles();
  const { register, handleSubmit, control, reset } = useForm();
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
        console.log(result.data);
        setFeedComments([result.data, ...feedComments]);
      })
      .catch((err) => {
        console.log(err);
      });

    reset();
  };
  return (
    <Container className={classes.container}>
      <Dialog
        onClose={onClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        // className={classes.container}
      >
        <DialogTitle id="simple-dialog-title">Messages</DialogTitle>
        <DialogContent>
          <Card className={classes.card}>
            <CardMedia
              className={classes.image}
              image={feed.profile?.profilePic}
              title="Profile Image"
            />
            <CardContent className={classes.content}>
              <Typography variant="h5">{feed?.createdBy.name}</Typography>
              <Typography variant="body1">{feed?.message}</Typography>
              <Button aria-label="like" onClick={handleLike}>
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
              </Button>
              {/* <Button onClick={() => setDialogOpen(true)}>
              <CommentIcon /> {commentsCount}
            </Button> */}
              <Button aria-label="like" onClick={handleDeleteFeed}>
                <DeleteIcon />
              </Button>
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
          <CommentList feedComments={feedComments} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

const CommentList = ({ feedComments }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <List>
        {feedComments.map((feed, index) => {
          return (
            <Card className={classes.card} key={index}>
              <CardMedia
                className={classes.image}
                image={feed.profile.profilePic}
                title="Profile Image"
              />
              <CardContent className={classes.content}>
                <Typography variant="h5">{feed?.createdBy.name}</Typography>
                <Typography variant="body1">{feed?.message}</Typography>
                {/* <Button aria-label="like" onClick={handleLike}>
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
                </Button> */}
                {/* <Button onClick={() => setDialogOpen(true)}>
        <CommentIcon /> {commentsCount}
      </Button> */}
                {/* <Button aria-label="like" onClick={handleDeleteFeed}>
                  <DeleteIcon />
                </Button> */}
              </CardContent>
            </Card>
          );
        })}
      </List>
    </React.Fragment>
  );
};
