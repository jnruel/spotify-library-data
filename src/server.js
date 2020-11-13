import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import cookieParser from 'cookie-parser'
const axios = require('axios');
const qs = require('qs');
import { CLIENT_ID, CLIENT_SECRET, CookieHelper  } from './util/auth';
// import jwt from 'jsonwebtoken';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const getAccessToken = async (req, res) => {
  let accessToken = req.cookies['spotify-access-token'];
  let refreshToken = req.cookies['spotify-refresh-token'];

  // If access token cookie is set, you're likely authenticated.
  if (accessToken) {
    return accessToken;
  }
  // Reauthenticate if no access token, but refresh token exists.
  else if (!accessToken && refreshToken) {
    let cookieHelper = new CookieHelper(req, res);

    const postData = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };

    const axiosOptions = {
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET, 'utf8').toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    let spotifyResponse = await axios.post('https://accounts.spotify.com/api/token', qs.stringify(postData), axiosOptions);
    let data = spotifyResponse.data;

    const { access_token: accessToken, expires_in: expiresIn } = data;
    cookieHelper.setAccessToken(accessToken, expiresIn);

    return accessToken;
  }

  // Else, you're not authenticated.
  return null;
}

const app = polka() // You can also use Express
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    cookieParser(),
    sapper.middleware({
      session: async (req, res) => {
        // Set status of authentication in session:
        return { access_token: await getAccessToken(req, res) }
      }
    })
  )
  .listen(PORT, err => {
    if (err) console.log('error', err);
  });

export default app;
