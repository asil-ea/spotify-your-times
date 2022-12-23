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

  // declare a type as an object with the keys of the top tracks by year object as keys and the values as arrays of tracks
  type TopYearsAndTheirTracksType = {
    [key: string]: any[];
  };

  // const [code, setCode] = useState<String | String[] | undefined>(); // TODO: figure the type out
  const [bearer, setBearer] = useState();
  const [timeRange, setTimeRange] = useState("medium_term");
  const [topTracks, setTopTracks] = useState();
  const [topYearsAndTheirTracks, setTopYearsAndTheirTracks] =
    useState<TopYearsAndTheirTracksType>();
  const [selectedYears, setSelectedYears] = useState<any>();
  const [selectedYearsAndTheirTracks, setSelectedYearsAndTheirTracks] =
    useState<any>();

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
        console.log("response", res.data);
        setTopTracks(res.data.items);
        console.log("getReleaseYears()", getReleaseYears(res.data.items));
        console.log(
          "getTracksByYear()",
          getTracksByYear(res.data.items, "2020", "2016", "2009")
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // a function that scrapes the release years of the top tracks from the album object, and returns an object with the years as keys and the array of tracks as values
  const getReleaseYears = (tracks: any) => {
    const topYearsAndTheirTracks: any = {};
    tracks.forEach((track: any) => {
      const year = track.album.release_date.slice(0, 4);
      if (topYearsAndTheirTracks[year]) {
        topYearsAndTheirTracks[year].push(track);
      } else {
        topYearsAndTheirTracks[year] = [track];
      }
    });
    setTopYearsAndTheirTracks(topYearsAndTheirTracks);
    return topYearsAndTheirTracks;
  };

  // a function that takes more than one years and tracks as arguments and returns an array of tracks that were released in that year
  const getTracksByYear = (tracks: any, ...years: string[]) => {
    const topTracksByYear: any = {};
    tracks.forEach((track: any) => {
      const year = track.album.release_date.slice(0, 4);
      if (years.includes(year)) {
        if (topTracksByYear[year]) {
          topTracksByYear[year].push(track);
        } else {
          topTracksByYear[year] = [track];
        }
      }
    });
    return topTracksByYear;
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
    console.log("timeRange", timeRange);
  }, [timeRange]);

  const handleTermSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetchTopTracks(bearer, timeRange);
  };

  const handleYearsSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // get checked years and add them to an array
    const checkedYears: any = [];
    const checkboxes = document.querySelectorAll("input[type=checkbox]");
    checkboxes.forEach((checkbox: any) => {
      if (checkbox.checked) {
        checkedYears.push(checkbox.value);
      }
    });
    setSelectedYears(checkedYears);
    console.log("checkedYears", checkedYears);
    console.log(
      "getTracksByYear()",
      getTracksByYear(topTracks, ...checkedYears)
    );
  };

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
      <form onSubmit={(e) => handleTermSubmit(e)}>
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
          checked
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
        <input type="submit" value="send" />
      </form>
      <hr />
      <form onSubmit={(e) => handleYearsSubmit(e)}>
        {/* a seperate radio button per topYearsAndTheirTracks. */}
        {/* {topYearsAndTheirTracks &&
          Object.keys(topYearsAndTheirTracks).sort((a, b) => {
            return (
              topYearsAndTheirTracks[b].length -
              topYearsAndTheirTracks[a].length
            );
          }).map((year) => {
            return (
              <div key={year}>
                <input type="checkbox" name="year" value={year} />
                <label htmlFor={year}>{`${year} (${
                  topYearsAndTheirTracks[year].length
                } ${
                  topYearsAndTheirTracks[year].length == 1 ? "track" : "tracks"
                })`}</label>
              </div>
            );
          })} */}
          {/* a seperate dropdown per topYearsAndTheirTracks. the dropdown contents must be the track information */}
          {topYearsAndTheirTracks &&
            Object.keys(topYearsAndTheirTracks).sort((a, b) => {
              return (
                topYearsAndTheirTracks[b].length -
                topYearsAndTheirTracks[a].length
              );
            }).map((year) => {
              return (
                <div key={year}>
                  <label htmlFor={year}>{`${year} (${
                    topYearsAndTheirTracks[year].length
                  } ${
                    topYearsAndTheirTracks[year].length == 1 ? "track" : "tracks"
                  })`}</label>
                  <select name={year} id={year}>
                    {topYearsAndTheirTracks[year].map((track) => {
                      return (
                        <option key={track.id} value={track.id}>
                          {track.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              );
            })}
        <br />
      </form>
    </>
  );
}
