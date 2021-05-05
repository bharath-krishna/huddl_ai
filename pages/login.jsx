import {
  Button,
  Container,
  FormControl,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { useForm, userForm } from "react-hook-form";
import { verifyToken } from "../utils/validateToken";
import { isBrowser } from "../utils/getAbsoluteURL";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  formControl: {
    minWidth: 300,
    paddingTop: "40px",
  },
}));

function login() {
  const classes = useStyles();
  const router = useRouter();
  const [cookie, setCookie] = useCookies(["user"]);
  const { register, control, handleSubmit, reset } = useForm();

  const handleLogin = (data) => {
    const profile = verifyToken(data.token);
    if (profile) {
      setCookie("user", {
        maxAge: 3600,
        sameSite: true,
        token: data.token,
      });
      router.push("/" + `${profile.id}`);
    } else {
      alert("Invalid Token");
    }
  };
  return (
    <Grid container>
      <Grid item sm={12} xs={12} className={classes.container}>
        <Typography variant="h4" color="secondary">
          Login Page
        </Typography>
      </Grid>
      <Grid item sm={12} xs={12} className={classes.container}>
        <form onSubmit={handleSubmit(handleLogin)}>
          <FormControl className={classes.formControl}>
            <TextField
              label="Jwt Token"
              {...register("token", {
                required: "Required",
              })}
              fullWidth
              multiline
            />
            <Button type="Submit">Login</Button>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  if (!isBrowser() && res) {
    if (req.cookies.user && req.cookies.user !== "undefined") {
      const { token } = JSON.parse(req.cookies.user);
      const profile = verifyToken(token);
      if (profile) {
        return {
          redirect: {
            permanent: false,
            destination: "/" + `${profile.id}`,
          },
        };
      }
    }
  }
  return {
    props: {},
  };
};

export default login;
