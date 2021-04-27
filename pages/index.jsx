import { Button, Container, makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useCookies, withCookies } from "react-cookie";
import { isBrowser } from "../utils/getAbsoluteURL";
import isValidToken from "../utils/isValidToken";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "center",
  },
}));

function index({ cookies, allCookies }) {
  const classes = useStyles();
  const router = useRouter();
  const [cookie, removeCookie] = useCookies(["user"]);

  const handlogout = () => {
    removeCookie("user");
    router.push("/login");
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
    console.log(req.cookies.user);
    if (req.cookies.user && req.cookies.user !== "undefined") {
      const { token } = JSON.parse(req.cookies.user);
      if (!isValidToken(token)) {
        return {
          redirect: {
            permanent: false,
            destination: "/login",
          },
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

export default withCookies(index);
