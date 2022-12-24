import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { Button, Container } from "@mui/material";
import { FaSpotify } from "react-icons/fa";

export function getStaticProps() {
  return {
    props: {
      clientId: process.env.APP_CLIENTID,
      clientSecret: process.env.APP_CLIENTSECRET,
      redirectUri: process.env.APP_REDIRECTURI,
    },
  };
}

export default function Home({
  clientId,
  clientSecret,
  redirectUri,
}: {
  clientId: string | undefined;
  clientSecret: string | undefined;
  redirectUri: string | undefined;
}) {
  const [generateState, setGenerateState] = useState(() => (length: Number) => {
    // TODO: use state
    const crypto = require("crypto");

    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-!&+%?*/.;,:<>^${[]}()_|=";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    let hashed = crypto.createHash("sha1").update(result).digest("hex");
    // sessionStorage.setItem("state", hashed); // sessionStorage is not available, because this is a server-side rendered page
    return hashed;
  });

  return (
    <div style={{
      backgroundColor: "#1DB954"
    }}>
      <Head>
        <title>Spotify Your Times</title>
        <meta name="description" content="Spotify your times" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className={styles.container}>
        <Button
          startIcon={<FaSpotify />}
          color="success"
          size="large"
          href={`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=user-top-read`}
          variant="contained"
        >
          Log in with Spotify
        </Button>
      </Container>
    </div>
  );
}
