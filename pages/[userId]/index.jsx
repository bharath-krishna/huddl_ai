import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  List,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCookies, withCookies } from "react-cookie";
import { connect } from "react-redux";
import { setFeeds } from "../../redux/actions/feeds";
import { setUserProfile } from "../../redux/actions/userProfileActions";
import { getById } from "../../utils/general";
import getAbsoluteURL, { isBrowser } from "../../utils/getAbsoluteURL";
import { verifyToken } from "../../utils/validateToken";
import axios from "axios";
import CustomAppBar from "../components/CustomAppBar";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import { red } from "@material-ui/core/colors";
import FeedItem from "../components/FeedItem";
import { AccountCircle } from "@material-ui/icons";
import { useForm } from "react-hook-form";
import profile from "../api/profile";
import { setComments } from "../../redux/actions/comments";

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

function index({
  cookies,
  allCookies,
  feeds,
  setFeeds,
  userProfile,
  setUserProfile,
  comments,
  setComments,
}) {
  const classes = useStyles();
  const router = useRouter();
  const { userId } = router.query;
  const [cookie, removeCookie] = useCookies(["user"]);
  const [unauthorized, setUnauthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, control, reset } = useForm();

  useEffect(() => {
    getById("profile", userId).then((profile) => {
      if (profile) {
        setUserProfile({ ...profile, id: userId });
        setLoading(false);
      } else {
        setUnauthorized(true);
      }
    });

    axios
      .get(`/api/profile/${userId}/likes`, {
        headers: { Authorization: `Bearer ${cookie.user.token}` },
      })
      .then(({ data }) => {
        if (data) {
          setUserProfile({ ...userProfile, likes: data });
          setLoading(false);
        }
      })
      .catch((err) => {
        alert("Failed to fetch feeds");
      });

    axios
      .get("/api/feeds", {
        headers: { Authorization: `Bearer ${cookie.user.token}` },
      })
      .then(({ data }) => {
        setFeeds(data);
      })
      .catch((err) => {
        alert("Failed to fetch feeds");
      });

    axios
      .get("/api/comments", {
        headers: { Authorization: `Bearer ${cookie.user.token}` },
      })
      .then(({ data }) => {
        setComments(data);
      })
      .catch((err) => {
        alert("Failed to fetch comments");
      });
  }, []);
  const handlogout = () => {
    removeCookie("user");
    router.push("/login");
  };

  const handleMessage = (data) => {
    const body = {
      message: data.message,
    };
    axios
      .post("/api/feeds", body, {
        headers: { Authorization: `Bearer ${cookie.user.token}` },
      })
      .then((result) => {
        if (result.statusText == "OK") {
          setFeeds([result.data, ...feeds]);
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
            {loading ? (
              <div>Loading....</div>
            ) : (
              <React.Fragment>
                <form onSubmit={handleSubmit(handleMessage)}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      label="Enter message"
                      {...register("message", {
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
                <List>
                  {feeds.map((feed, index) => {
                    return (
                      <FeedItem
                        feed={feed}
                        key={index}
                        // userProfile={userProfile}
                      />
                    );
                  })}
                </List>
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

export const getServerSideProps = async ({ req, res, query }) => {
  if (!isBrowser() && res) {
    if (req.cookies.user && req.cookies.user !== "undefined") {
      const { token } = JSON.parse(req.cookies.user);
      const data = verifyToken(token);
      if (query.userId !== data.id) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
      if (!data) {
        return {
          redirect: {
            permanent: false,
            destination: "/login",
          },
        };
      } else {
        return {
          props: {},
        };
      }
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
      };
    }
  }
  return {
    props: {},
  };
};

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
    setComments: (comments) => dispatch(setComments(comments)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(index));
