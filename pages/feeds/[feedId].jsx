import {
  Button,
  Container,
  FormControl,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import getAbsoluteURL from "../../utils/getAbsoluteURL";
import CustomAppBar from "../components/CustomAppBar";
import FeedItem from "../components/FeedItem";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "center",
    maxWidth: 800,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  avatar: {
    backgroundColor: red[500],
  },
  formControl: {
    minWidth: 400,
    paddingTop: "40px",
  },
}));

function comments({ feed, comments }) {
  const classes = useStyles();
  const [cookie, removeCookie] = useCookies(["user"]);
  const { register, handleSubmit, control, reset } = useForm();

  const handlogout = () => {
    removeCookie("user");
    router.push("/login");
  };

  const handleComment = (data) => {
    const body = {
      message: data.comment,
    };
    axios
      .post(`/api/feeds/${feed.id}/comments`, body, {
        headers: { Authorization: `Bearer ${cookie.user.token}` },
      })
      .then((result) => {
        if (result.statusText == "OK") {
          // setFeeds([result.data, ...feeds]);
        }
      });
    reset();
  };
  return (
    <React.Fragment>
      <CustomAppBar handlogout={handlogout} />
      <Container>
        <Grid container className={classes.container}>
          <Grid item sm={4} xs={12}>
            profile section
          </Grid>
          <Grid item sm={8} xs={12}>
            <FeedItem feed={feed} />
            <form onSubmit={handleSubmit(handleComment)}>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Enter comment"
                  {...register("comment", {
                    required: "Required",
                  })}
                  rows={4}
                  fullWidth
                  multiline
                />
                <Button type="submit" color="primary">
                  Send
                </Button>
              </FormControl>
            </form>
            Comments
            {comments.map((comment, index) => {
              return <FeedItem key={index} feed={comment} />;
            })}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

export const getServerSideProps = async ({ req, res, query }) => {
  const { feedId } = query;
  let url = getAbsoluteURL(`/api/feeds/${feedId}`, req);
  const { token } = JSON.parse(req.cookies.user);
  let resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const feed = await resp.json();

  url = getAbsoluteURL(`/api/feeds/${feedId}/comments`, req);
  resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const comments = await resp.json();

  return {
    props: { feed: feed, comments: comments },
  };
};

export default comments;
