import {
  Divider,
  Grid,
  Typography,
  Link as MuiLink,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import MangaInfoCharacters from "./MangaInfoCharacters";
import MangaInfoMangaDetails from "./MangaInfoMangaDetails";
import MangaInfoRecommendedManga from "./MangaInfoRecommendedManga";

const MangaInfoSideContent = (props) => {
  const [info, setInfo] = useState();
  const [externalLinks, setExternalLinks] = useState();

  const [mangaRelations, setMangaRelations] = useState();
  const [mangaRecommendationsList, setMangaRecommendationsList] = useState();

  let navigate = useNavigate();

  const getManga = useCallback(
    async (id) => {
      id = props.mangaId;
      console.log(id);
      try {
        //Grabs Manga Data Object
        const mangaData = await fetch(
          `https://api.jikan.moe/v4/manga/${id}`,
        ).then((res) => res.json());

        let mangaResults = mangaData.data;
        console.log(mangaResults);
        setInfo(mangaResults);

        // Grabs Related Manga Data
        let relatedMangaData = await fetch(
          `https://api.jikan.moe/v4/manga/${id}/relations`,
        ).then((res) => res.json());

        let relatedMangaDataResults = relatedMangaData.data;
        console.log("RelatedManga", relatedMangaDataResults);
        setMangaRelations(relatedMangaDataResults);

        // return results;
      } catch (error) {
        console.log("Manga not found");
      }

      try {
        //Grabs Manga Recs
        let mangaRecommendationsData = await fetch(
          `https://api.jikan.moe/v4/manga/${id}/recommendations`,
        ).then((res) => res.json());
        let mangaRecommendationsDataResults = mangaRecommendationsData.data;

        setMangaRecommendationsList(mangaRecommendationsDataResults);
      } catch (error) {
        console.log("Manga Recs not found");
      }
    },
    [props.mangaId],
  );

  useEffect(() => {
    if (!info && !mangaRelations && !mangaRecommendationsList) {
      getManga(props.mangaId).catch(console.error);
    }
  }, [mangaRelations, getManga, info, props.mangaId, mangaRecommendationsList]);

  // const getManga = useCallback(async (id) => {
  //   id = props.mangaId;
  //   try {
  //     const temp = await fetch(`https://api.jikan.moe/v4/manga/${id}`).then(
  //       (res) => res.json(),
  //     );

  //     let results = temp.data;
  //     console.log(results);
  //     setInfo(results);
  //     return results;
  //   } catch (error) {
  //     console.log("Manga not found");
  //   }
  // }, []);

  // const getExternalAnimeLinks = useCallback(async (id) => {
  //   id = props.animeId;

  //   const temp = await fetch(
  //     `https://api.jikan.moe/v4/anime/${id}/external`,
  //   ).then((res) => res.json());

  //   setExternalLinks(temp.data);
  //   return temp.data;
  // }, []);

  // useEffect(() => {
  //   if (!info) {
  //     getManga(props.mangaId).catch(console.error);
  //   }

  //   // getExternalAnimeLinks(50265).catch(console.error);
  // }, [getManga, info, props.mangaId]);

  if (info && mangaRelations) {
    return (
      <div>
        <MangaInfoMangaDetails
          mangaId={info.mal_id}
          mangaRecList={mangaRecommendationsList}
        />
        <div className='anime-info-main'>
          <div className='anime-info-side-content'>
            <ImageList cols={1}>
              <ImageListItem>
                <Box
                  component='img'
                  src={info.images.jpg.image_url}
                  alt={info.title}
                  sx={{ width: "100%", height: "100%" }}
                />
                <ImageListItemBar
                  title={info.title}
                  subtitle={
                    info.title !== info.title_english && (
                      <Typography
                        sx={{ paddingTop: 1 }}
                      >{`(${info.title_english})`}</Typography>
                    )
                  }
                />
              </ImageListItem>
            </ImageList>
            <div className='anime-info-alternative-titles-container'>
              <h3>Alternate Titles:</h3>
              {info.title_english && (
                <Typography className='anime-info-alternative-english'>
                  {`English: ${info.title_english}`}
                </Typography>
              )}
              {info.title_japanese && (
                <Typography className='anime-info-alternative-japanese'>
                  {`Japanese: ${info.title_japanese}`}
                </Typography>
              )}
              {info.title_synonyms && (
                <div>
                  <h3>Synonyms</h3>
                  {info.title_synonyms > 0
                    ? info.title_synonyms.map((altTitles) => (
                        <Typography className='anime-info-title-synonyms'>
                          {altTitles}
                        </Typography>
                      ))
                    : "N/A"}
                </div>
              )}
            </div>
            <div className='anime-info-information'>
              <h3>Information</h3>
              <Typography>{`Type: ${info.type}`}</Typography>
              <Typography>{`Volumes: ${
                info.volumes ? info.volumes : "N/A"
              }`}</Typography>
              <Typography>{`Chapters: ${
                info.chapters ? info.chapters : "N/A"
              }`}</Typography>
              <Typography>{`Status: ${info.status}`}</Typography>
              <Typography>{`Published: ${info.published.string}`}</Typography>
              <Typography>{`Genres: ${info.genres.map((genres) =>
                genres ? ` ${genres.name} ` : "N/A",
              )}`}</Typography>
              <Typography>{`Theme: ${
                info.themes > 0
                  ? info.themes.map((themes) =>
                      themes ? ` ${themes.name} ` : "N/A",
                    )
                  : "N/A"
              }`}</Typography>
              <Typography>{`Demographics: ${
                info.demographics > 0
                  ? info.demographics.map((demographics) =>
                      demographics ? ` ${demographics.name} ` : "N/A",
                    )
                  : "N/A"
              }`}</Typography>
              <Typography>{`Serializations: ${info.serializations.map(
                (serialization) =>
                  serialization ? ` ${serialization.name} ` : "N/A",
              )}`}</Typography>
              <Typography>{`Author(s): ${info.authors.map((authors) =>
                authors ? ` ${authors.name} ` : "N/A",
              )}`}</Typography>
            </div>
            <div className='anime-info-statistics'>
              <h3>Statistics</h3>
              <Typography>{`Score: ${
                info.score ? info.score : "N/A"
              }`}</Typography>
              <Typography>{`Ranked: ${
                info.rank ? info.rank : "N/A"
              }`}</Typography>
              <Typography>{`Popularity: ${info.popularity}`}</Typography>
              <Typography>{`Members: ${info.members}`}</Typography>
              <Typography>{`Favorites: ${info.favorites}`}</Typography>
            </div>
          </div>
          <div className='anime-info-main-info-container'>
            <div className='anime-info-main-popularity-container'>
              <div className='anime-info-main-synopsis'>
                <h3>Synopsis</h3>
                <Typography>{info.synopsis ? info.synopsis : "N/A"}</Typography>
              </div>

              {/* <Divider sx={{ pb: 4 }} /> */}
              <div className='anime-info-content-guts'>
                <h3>Background</h3>
                <Typography>
                  {info.background ? info.background : "N/A"}
                </Typography>
                <Divider sx={{ pb: 4 }} />

                <h3>Related Manga</h3>
                <div className='anime-info-related-anime-container'>
                  {mangaRelations.length > 0
                    ? mangaRelations.map((info) => {
                        let relatedAnime = info.entry;
                        let relatedAnimeType = info.relation;
                        console.log(info);
                        return relatedAnime.map((single) => {
                          console.log(single);
                          return (
                            <div>
                              <MuiLink
                                onClick={(e) => {
                                  navigate(
                                    single.type === "anime"
                                      ? "/anime-info"
                                      : "/manga-info",

                                    single.type === "anime"
                                      ? { state: { animeId: single.mal_id } }
                                      : { state: { mangaId: single.mal_id } },
                                  );
                                  window.location.reload();
                                }}
                              >
                                <Typography className='anime-info-related-anime-item'>{`${relatedAnimeType}: ${single.name}`}</Typography>
                              </MuiLink>
                            </div>
                          );
                        });
                      })
                    : "N/A"}
                </div>
                <Divider sx={{ pb: 4 }} />

                <h3>Characters</h3>
                <MangaInfoCharacters mangaId={info.mal_id} />

                <Divider sx={{ pb: 4 }} />
                <h3>Recommended Manga</h3>
                <MangaInfoRecommendedManga mangaId={info.mal_id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default MangaInfoSideContent;
