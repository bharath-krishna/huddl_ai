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

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    marginTop: 20,
  },
  image: {
    minWidth: 150,
  },
}));

function FeedItem({ feed, userProfile, setUserProfile, feeds, setFeeds }) {
  const classes = useStyles();
  const [likesCount, setLikesCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [cookie, removeCookie] = useCookies(["user"]);
  const router = useRouter();
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

        let index = feeds.findIndex(
          (deletedFeed) => deletedFeed.id === feed.id
        );
        feeds.splice(index, 1);
        setFeeds(feeds);
      })
      .catch((err) => {});
  };

  // const handleComment = () => {
  //   router.push(`/${feed.id}/comments`);
  // };
  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardMedia
          className={classes.image}
          image="/beach.jpg"
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
          <Button component={CustomLink} href={`/feeds/${feed.id}`}>
            <CommentIcon />
          </Button>
          <Button aria-label="like" onClick={handleDeleteFeed}>
            <DeleteIcon />
          </Button>
        </CardContent>
      </Card>
    </React.Fragment>
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
