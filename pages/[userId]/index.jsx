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
import firebase from "../../utils/firebaseClient";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "center",
    maxWidth: 800,
  },
  avatar: {
    backgroundColor: red[500],
  },
  formControl: {
    minWidth: 400,
    paddingTop: "40px",
  },
  card: {
    maxWidth: 345,
    maxHeight: 200,
  },
  image: { height: 200, width: 200 },
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
    if (userProfile) {
      setUserProfile(userProfile);
      setLoading(false);
    } else {
      setUnauthorized(true);
    }
    // Set feeds props received from server
  }, []);
  useEffect(() => {
    axios
      .get("/api/feeds", {
        headers: { Authorization: `Bearer ${cookie.user.token}` },
      })
      .then((result) => {
        setFeeds([...result.data]);
      })
      .catch((err) => {});
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
          return [
            { ...result.data, likes: [], comments: [], profile: userProfile },
            ...feeds,
          ];
        } else {
        }
      })
      .catch((err) => {})
      .then((respFeeds) => {
        console.log(respFeeds === feeds, "respFeeds === feeds in index");
        setFeeds([...respFeeds]);
      });
    reset();
  };

  const storage = firebase.storage();

  return (
    <React.Fragment>
      <CustomAppBar handlogout={handlogout} />
      <Container>
        <Grid container>
          <Grid item sm={4} xs={12} className={classes.container}>
            <Card className={classes.card}>
              <CardHeader
                title={userProfile.name}
                subheader={`${userProfile.age} years, ${userProfile.gender}`}
              />
              <CardMedia
                component="img"
                className={classes.image}
                image={userProfile.profilePic}
                height="100"
                title="ProfilePic"
                alt="pic"
              />
              <CardContent></CardContent>
            </Card>
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
                    return <FeedItem feed={feed} key={index} />;
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
      const { userId } = query;

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
        let url = getAbsoluteURL(`/api/profile/${userId}`, req);
        let userProfile = await axios
          .get(url, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((result) => {
            return result.data;
          })
          .catch((err) => {});

        return {
          props: { userProfile },
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
