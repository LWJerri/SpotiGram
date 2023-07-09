# Description

This is a separate feature from my main **UserBot** script developed for handling Spotify links in direct messages. Links received in messages on Telegram will be processed by the script and transferred to Spotify.

> The script can handle multiple links in one message and is also integrated with [@OdesliBot](https://t.me/odesli_bot).

## Installation Instructions

### Requirements

- Installed [Node.js](https://nodejs.org) v16 or highter and enabled [corepack](https://nodejs.org/api/corepack.html) (Optional).
  - Just run `corepack enable` in your cmd if you plane run script outside Docker.
- Installed [Docker](https://www.docker.com) (Optional).

### Installing Steps

1. Visit the [Spotify for Developers](https://developer.spotify.com/dashboard) page and click on "New app".
2. Copy "Client ID" & "Client secret" and add to **Redirect URIs** this URL: `https://localhost`.
3. Clone repository: `git clone https://github.com/LWJerri/SpotiGram.git`.
4. Rename `.env.example` to `.env` and configurate keys.

## Telegram API Credentials

- Obtain your `APP_ID` and `APP_HASH` from [My Telegram](https://my.telegram.org). Go to Your **Telegram Core** > **API development tools**, copy "app_id" and "app_hash".
- To get the `SESSION` value, run `pnpm auth`, fill in the required fields, and copy the generated token.

## Spotify Tokens

- Edit this link: `https://accounts.spotify.com/authorize?response_type=code&client_id=CLIENT_ID&scope=playlist-read-private+user-read-playback-state+user-read-currently-playing+user-read-recently-played+user-read-playback-state+user-modify-playback-state+playlist-modify-public+playlist-modify-private&redirect_uri=https%3A%2F%2Flocalhost` by replacing "CLIENT_ID" with your actual client ID. Open the modified link in your browser and agree to the permissions.
- After agreeing, you will be redirected to a page. Copy the code from the URL after `?code=`.
- In your terminal, run this command: `curl -d client_id=YOUR_CLIENT_ID -d client_secret=YOUR_CLIENT_SECRET -d grant_type=authorization_code -d code=CODE_FROM_PREVIOUS_STEP -d redirect_uri=https://localhost https://accounts.spotify.com/api/token`, and receive a JSON response. Look for the `refresh_token` field and copy its value.
- Finally, fill in your `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` with the values from the previous steps.
- Create a new Spotify playlist, copy its ID from the URL, and save it to `SPOTIFY_PLAYLIST_ID`.

> URL: `https://open.spotify.com/playlist/0Z78i4Fm10pnQFRZ9NLdBa?si=2973a422114c44e0`, playlist id is `0Z78i4Fm10pnQFRZ9NLdBa`.

5. Run with `Docker` or `Node.js`:

> **For Docker:** Run command `docker build -t spotigram .` in your cmd and after `docker run -d spotigram`. Done.

> For **Node.js**: Run `pnpm build` and after `pnpm start`. Tada 🔥🔥

## Contributing

This project opened for contributions and any suggestions! You can create a new `Issue` or make a `Pull request` with your code changes.

## LICENSE

This code has an **MIT** license. See the `LICENSE` file for getting more information.
