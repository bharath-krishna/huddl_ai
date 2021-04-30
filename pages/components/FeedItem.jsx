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
import React from "react";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import { red } from "@material-ui/core/colors";

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

function FeedItem({ feed }) {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.image}
        image="/beach.jpg"
        title="Profile Image"
      />
      <CardContent className={classes.content}>
        <Typography variant="h5">{feed.createdBy}</Typography>
        <Typography variant="body1">{feed.message}</Typography>
        <Typography variant="caption">{feed.createdAt}</Typography>
      </CardContent>
      <CardActionArea>
        <CardActions>
          <IconButton aria-label="like">
            <FavoriteIcon />
          </IconButton>
        </CardActions>
      </CardActionArea>
    </Card>
  );
}

export default FeedItem;
