import {
  Container,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Paper,
  Grid,
  CardContent,
} from "@mui/material";
import Card from "@mui/material/Card";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { TopYearsAndTheirTracksContext } from "./contexts/TopYearsAndTheirTracksContext";

export default function Results() {
  const { TopYearsAndTheirTracks, setTopYearsAndTheirTracks } = useContext(
    TopYearsAndTheirTracksContext
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#1DB954",
        padding: "1rem",
      }}
    >
      <Container>
        <Typography
          variant="h4"
          sx={{ color: "#FFFFFF", marginBottom: "2rem" }}
        >
          You really are a time traveller! Here are your top tracks by year:
        </Typography>
        {/* a seperate dropdown per TopYearsAndTheirTracks. the dropdown contents must be the track information */}
        {TopYearsAndTheirTracks &&
          Object.keys(TopYearsAndTheirTracks)
            .sort((a, b) => {
              return (
                TopYearsAndTheirTracks[b].length -
                TopYearsAndTheirTracks[a].length
              );
            })
            .map((year) => {
              return (
                <>
                  <Accordion key={year}>
                    <AccordionSummary expandIcon={<FaChevronDown />}>
                      <Typography sx={{ width: "33%", flexShrink: 0 }}>
                        {year}
                      </Typography>
                      <Typography sx={{ color: "text.secondary" }}>
                        {`${TopYearsAndTheirTracks[year].length} ${
                          TopYearsAndTheirTracks[year].length == 1
                            ? "track"
                            : "tracks"
                        }`}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid
                        container
                        spacing={2}
                        justifyContent="center"
                        alignItems="stretch"
                      >
                        {TopYearsAndTheirTracks[year].map((track: any) => {
                          console.log(track);
                          return (
                            <Grid item xs={4} key={track.name}>
                              <Card elevation={3} style={{ height: "100%" }}>
                                <CardContent
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography variant="overline">
                                    {/* display all artists' names */}
                                    {track.artists.map((artist: any) => {
                                      // if there are multiple artists, add a comma after each name but dont add a comma after the last name
                                      if (
                                        track.artists.indexOf(artist) !=
                                        track.artists.length - 1
                                      ) {
                                        return artist.name + ", ";
                                      } else {
                                        return artist.name;
                                      }
                                    })}
                                  </Typography>
                                  <Image
                                    src={track.album.images[1].url}
                                    alt={track.album.name}
                                    width="150"
                                    height="150"
                                    style={{ marginBottom: "0.5rem", borderRadius: "6px" }}
                                  />
                                  <Typography variant="subtitle1">
                                    {track.name}
                                  </Typography>
                                  <Typography variant="subtitle2">
                                    Released: {track.album.release_date}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </>
              );
            })}
      </Container>
    </div>
  );
}
