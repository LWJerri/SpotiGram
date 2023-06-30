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

1. Go to [Spotify developers](https://developer.spotify.com/dashboard) page and create new app.
2. Copy `Client ID`, `Client secret` and add to **Redirect URIs** this URL: `https://musing.vercel.app/callback`.
3. Clone this repository: `git clone https://github.com/LWJerri/UserBotMusic.git`.
4. Rename and setup `.env.example`.

- `APP_ID`, `APP_HASH` take from official [My Telegram](https://my.telegram.org). Navigate to **Your Telegram Core** > **API development tools** and take all required info.
- To get `SESSION` you need run `pnpm auth`, fill required fields and after copy long token.
- To setup `SPOTIFY_REFRESH_TOKEN` do this steps:
  - Edit this link `https://accounts.spotify.com/authorize?response_type=code&client_id=CLIENT_ID&scope=playlist-read-private+user-read-playback-state+user-read-currently-playing+user-read-recently-played+user-read-playback-state+user-modify-playback-state+playlist-modify-public+playlist-modify-private&redirect_uri=https%3A%2F%2Fmusing.vercel.app%2Fcallback` and open. After click on agree button you will be redirected to page and must copy all after `?code=`. Now, open terminal and run this command `curl -d client_id=CLIENT_ID -d client_secret=CLIENT_SECRET -d grant_type=authorization_code -d code=CODE -d redirect_uri=https://musing.vercel.app/callback https://accounts.spotify.com/api/token`. You received JSON outtput, find `refresh_token` field, copy value and save it.
  - `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` fill from second step.
  - Create new playlist, copy id and save to `SPOTIFY_PLAYLIST_ID`.

5. Run with `Docker` or `pnpm`:

For Docker:

- Run docker command `docker build -t userbotmusic .` and after `docker run -d userbotmusic`. Done, ready to usage ;)

For pnpm:

- Run `pnpm build` and after `pnpm start`. Tada 🔥🔥

## Contributing

This project opened for contribution and any suggestions! You can create a new `Issue` or make an `Pull request` with your code changes.

## LICENSE

This code has **MIT** license. See the `LICENSE` file for getting more information.
