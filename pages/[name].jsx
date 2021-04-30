import { Button, Container, makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCookies, withCookies } from "react-cookie";
import { getById } from "../utils/general";
import getAbsoluteURL, { isBrowser } from "../utils/getAbsoluteURL";
import { verifyToken } from "../utils/validateToken";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "center",
  },
}));

function index({ cookies, allCookies, profile, feeds }) {
  const classes = useStyles();
  const router = useRouter();
  const { name } = router.query;
  const [cookie, removeCookie] = useCookies(["user"]);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (profile.name !== name) {
      // router.push("/");
    }
    getById("profile", name).then((profile) => {
      if (profile) {
      } else {
        setUnauthorized(true);
      }
    });
  }, []);
  const handlogout = () => {
    removeCookie("user");
    router.push("/login");
  };

  return (
    <Container className={classes.container}>
      {unauthorized ? (
        <div>
          You are not authorized to view others private pages, please visit
          /profile/userid to access public profile
        </div>
      ) : (
        <div>
          index Page
          <Button onClick={handlogout}>Logout</Button>
        </div>
      )}
    </Container>
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

        url = getAbsoluteURL("/api/feeds", req);
        resp = await fetch(url, { headers: { Authorization: token } });
        const feeds = await resp.json();
        return {
          props: {
            profile: profile,
            feeds: feeds,
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

export default withCookies(index);
