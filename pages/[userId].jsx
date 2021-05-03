import {
  Avatar,
  Button,
  Card,
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
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCookies, withCookies } from "react-cookie";
import { connect } from "react-redux";
import { setFeeds } from "../redux/actions/feeds";
import { getById } from "../utils/general";
import getAbsoluteURL, { isBrowser } from "../utils/getAbsoluteURL";
import { verifyToken } from "../utils/validateToken";
import axios from "axios";
import CustomAppBar from "./components/CustomAppBar";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import { red } from "@material-ui/core/colors";
import FeedItem from "./components/FeedItem";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "center",
    maxWidth: 600,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

function index({ cookies, allCookies, profile, feeds, setFeeds }) {
  const classes = useStyles();
  const router = useRouter();
  const { userId } = router.query;
  const [cookie, removeCookie] = useCookies(["user"]);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (profile.id !== userId) {
      // router.push("/");
    }
    getById("profile", userId).then((profile) => {
      if (profile) {
      } else {
        setUnauthorized(true);
      }
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
  }, []);
  const handlogout = () => {
    removeCookie("user");
    router.push("/login");
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
            <List>
              {feeds.map((feed, index) => {
                return (
                  <FeedItem feed={feed} key={index} profile={profile[0]} />
                );
              })}
            </List>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  if (!isBrowser() && res) {
    if (req.cookies.user && req.cookies.user !== "undefined") {
      const { token } = JSON.parse(req.cookies.user);
      const data = verifyToken(token);
      if (!data) {
        return {
          redirect: {
            permanent: false,
            destination: "/login",
          },
        };
      } else {
        let url = getAbsoluteURL("/api/profile", req);
        let resp = await fetch(url, { headers: { Authorization: token } });
        const profile = await resp.json();

        // url = getAbsoluteURL("/api/feeds", req);
        // resp = await fetch(url, { headers: { Authorization: token } });
        // const feeds = await resp.json();
        return {
          props: {
            profile: profile,
            // feeds: feeds,
          },
        };
      }
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }
  }
  return {
    props: {},
  };
};

function mapStateToProps(state) {
  return { feeds: state.feeds };
}

function mapDispatchToProps(dispatch) {
  return { setFeeds: (feeds) => dispatch(setFeeds(feeds)) };
}

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(index));
