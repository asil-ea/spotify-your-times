import "../styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import type { AppProps } from "next/app";
import { TopYearsAndTheirTracksContext } from "./contexts/TopYearsAndTheirTracksContext";
import React, { useContext, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [TopYearsAndTheirTracks, setTopYearsAndTheirTracks] = useState<any>({});

  return (
    <TopYearsAndTheirTracksContext.Provider value={{TopYearsAndTheirTracks, setTopYearsAndTheirTracks}}>
      <Component {...pageProps} />
    </TopYearsAndTheirTracksContext.Provider>
  );
}
