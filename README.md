# Description

This is a separate function from my main **UserBot** script for handling Spotify links from other users. Links received in private messages on Telegram will be processed by the script and transferred to Spotify.

The script can handle multiple links in one message and is also integrated with [@OdesliBot](https://t.me/odesli_bot).

## Installation

### Requirements

- Installed Node.js >= v18.
- Installed `pnpm`.
- Installed Docker (Optional).
- Basic knowledge of programming.

### Installing

1. Visit [Spotify developers](https://developer.spotify.com/dashboard) page and click `New app`.
2. Copy `Client ID`, and `Client secret` and add to **Redirect URIs** this URL: `https://musing.vercel.app/callback`.
3. Clone this repository: `git clone https://github.com/LWJerri/SpotiGram.git`.
4. Rename and set up `.env.example`.

- `APP_ID`, `APP_HASH` take from official [My Telegram](https://my.telegram.org). Navigate to **Your Telegram Core** > **API development tools** and take all required info.
- To get `SESSION` you need to run `pnpm auth`, fill required fields, and copy a long token.
- To set up `SPOTIFY_REFRESH_TOKEN` do these steps:
  - Edit `CLIENT_ID` in this link `https://accounts.spotify.com/authorize?response_type=code&client_id=CLIENT_ID&scope=playlist-read-private+user-read-playback-state+user-read-currently-playing+user-read-recently-played+user-read-playback-state+user-modify-playback-state+playlist-modify-public+playlist-modify-private&redirect_uri=https%3A%2F%2Fmusing.vercel.app%2Fcallback` and open. After clicking on agree button you will be redirected to the page and must copy all after `?code=`.
  - Now, open the terminal and run this command `curl -d client_id=CLIENT_ID -d client_secret=CLIENT_SECRET -d grant_type=authorization_code -d code=CODE_FROM_PREVIOUS_URL -d redirect_uri=https://musing.vercel.app/callback https://accounts.spotify.com/api/token`. You received JSON output, find the `refresh_token` field, copy the value, and save it.
  - `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` fill from second step.
  - Create a new playlist, copy id from URL and save it to `SPOTIFY_PLAYLIST_ID`.

5. Run with `Docker` or `pnpm`:

For Docker:

- Run docker command `docker build -t spotigram .` and after `docker run -d spotigram`. Done, ready to usage ;)

For pnpm:

- Run `pnpm build` and after `pnpm start`. Tada 🔥🔥

## Contributing

This project opened for contributions and any suggestions! You can create a new `Issue` or make a `Pull request` with your code changes.

## LICENSE

This code has an **MIT** license. See the `LICENSE` file for getting more information.
