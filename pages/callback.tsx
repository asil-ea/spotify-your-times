import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useSWR from "swr";

export function getStaticProps() {
  return {
    props: {
      clientId: process.env.APP_CLIENTID,
      clientSecret: process.env.APP_CLIENTSECRET,
      redirectUri: process.env.APP_REDIRECTURI,
    },
  };
}

const fetcher = (url: string, data: string, headers?: object) =>
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: headers,
  }).then((res) => res.data);

export default function Callback({
  clientId,
  clientSecret,
  redirectUri,
}: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}) {
  const router = useRouter();

  // const [code, setCode] = useState<String | String[] | undefined>(); // TODO: figure the type out
  const [bearer, setBearer] = useState();
  const [timeRange, setTimeRange] = useState("long_term");
  const fetchTopTracks = (bearer: string | undefined, timeRange: string) => {
    const url = "https://api.spotify.com/v1/me/top/tracks";
    const data = {
      limit: 50,
      time_range: timeRange,
    };
    const headers = {
      Authorization: `Bearer ${bearer}`,
    };

    axios({
      method: "GET",
      url: url,
      params: data,
      headers: headers,
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { data, error } = useSWR(
    router.query.code
      ? [
          "https://accounts.spotify.com/api/token",
          `grant_type=authorization_code&code=${router.query.code}&redirect_uri=${redirectUri}&client_id=${clientId}&client_secret=${clientSecret}`,
        ]
      : null,
    fetcher
  );

  useEffect(() => {
    setBearer(data?.access_token);
  }, [data]);

  useEffect(() => {
    console.log(timeRange);
  }, [timeRange]);

  function handleSubmit(e: any): void {
    e.preventDefault()
    fetchTopTracks(bearer, timeRange)
  }

  // this code block is not needed anymore, but i will keep it here for now
  // useEffect(() => {
  //   // this hook runs twice, i do not know why, but it works. fix this later on

  //   if (!router.isReady) return;
  //   setCode(router.query.code);

  //   const controller = new AbortController();

  //   axios({
  //     signal: controller.signal,
  //     method: "POST",
  //     url: "https://accounts.spotify.com/api/token",
  //     data: `grant_type=authorization_code&code=${router.query.code}&redirect_uri=${redirectUri}&client_id=${clientId}&client_secret=${clientSecret}`,
  //     // headers: {
  //     //   'Authorization': `Basic ${(new Buffer(process.env.APP_CLIENTID + ':' + process.env.APP_CLIENTSECRET).toString('base64'))}`
  //     // }
  //   })
  //     .then((response) => {
  //       console.log(response.data.access_token);
  //       setBearer(response.data.access_token);
  //       // router.push("/top");
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });

  //   console.log(router.query.code, router.isReady);

  //   return () => controller.abort();
  // }, [
  //   clientId,
  //   clientSecret,
  //   code,
  //   redirectUri,
  //   router.isReady,
  //   router.query.code,
  // ]);

  return (
    <>
      {/* create radio input with 3 options: short_term, medium_term, long_term */}
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="radio"
          name="timeRange"
          value="short_term"
          onChange={(e) => setTimeRange(e.target.value)}
        />
        <label htmlFor="short_term">Short Term</label>
        <br />
        <input
          type="radio"
          name="timeRange"
          value="medium_term"
          onChange={(e) => setTimeRange(e.target.value)}
        />
        <label htmlFor="medium_term">Medium Term</label>
        <br />
        <input
          type="radio"
          name="timeRange"
          value="long_term"
          onChange={(e) => setTimeRange(e.target.value)}
        />
        <label htmlFor="long_term">Long Term</label>
        <br />
        <input
          type="submit"
          value="send"
        />
      </form>
    </>
  );
}
