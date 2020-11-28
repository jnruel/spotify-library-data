import { CLIENT_ID, REDIRECT_URI, CookieHelper, generateRandomString } from '../../../util/auth';
const qs = require('qs');

const spotifyAuthScopes = [
  'playlist-read-collaborative',
  'playlist-read-private',
  'user-library-read'
];

const spotifyAuthEndpoint = 'https://accounts.spotify.com/authorize'

export async function get(req, res, next) {
  const authState = generateRandomString(16);
  const authScope = spotifyAuthScopes.join(' ');

  let cookieHelper = new CookieHelper(req, res);
  cookieHelper.setAuthState(authState);


  let authParams = qs.stringify({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: authScope,
    redirect_uri: REDIRECT_URI,
    state: authState
  });

  res.writeHead(302, {
    Location: spotifyAuthEndpoint + '?' + authParams,
    'Content-Type': 'text/html',
  });

  res.end();
}
