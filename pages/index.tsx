import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {

  const [generateState, setGenerateState] = useState(() => (length: Number) => {
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
  const [loginRequest, setLoginRequest] = useState(
    `https://accounts.spotify.com/authorize?client_id=${
      process.env.APP_CLIENTID
    }&response_type=code&redirect_uri=${
      process.env.APP_REDIRECTURI
    }&scope=user-top-read&state=${generateState(128)}`
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Spotify Your Times</title>
        <meta name="description" content="Spotify your times" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <a href={loginRequest}>
        <input type="button" value="Log in with Spotify" />
      </a>
    </div>
  );
}
