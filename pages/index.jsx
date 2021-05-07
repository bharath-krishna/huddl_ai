import React from "react";

function index() {
  return <div></div>;
}

export const getServerSideProps = async ({ req, res }) => {
  return {
    redirect: {
      permanent: false,
      destination: "/login",
    },
  };
};

export default index;
