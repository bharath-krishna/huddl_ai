import { Button, Container, makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useCookies, withCookies } from "react-cookie";
import getAbsoluteURL, { isBrowser } from "../../utils/getAbsoluteURL";
import { verifyToken } from "../../utils/validateToken";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "center",
  },
}));

function index({ cookies, allCookies }) {
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  const [cookie, removeCookie] = useCookies(["user"]);

  const handlogout = () => {
    removeCookie("user");
    router.push("/");
  };

  return (
    <Container className={classes.container}>
      index Page
      <Button onClick={handlogout}>Logout</Button>
    </Container>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  if (!isBrowser() && res) {
    if (req.cookies.user && req.cookies.user !== "undefined") {
      const { token } = JSON.parse(req.cookies.user);
      if (!verifyToken(token)) {
        return {
          redirect: {
            permanent: false,
            destination: "/",
          },
        };
      } else {
        return {
          props: { profile: null },
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
