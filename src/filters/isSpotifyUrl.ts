import { SPOTIFY_URL_REGEXP } from "../helpers/constants.js";

export const isSpotifyUrl = (url: string) => SPOTIFY_URL_REGEXP.test(url);
