import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, CookieHelper  } from '../../../util/auth';
const axios = require('axios');
const qs = require('qs');

export async function get(req, res, next) {
  let cookieHelper = new CookieHelper(req, res);

  // your application requests refresh and access tokens
  // after checking the state parameter
  let authCode = req.query.code || null;
  let authState = req.query.state || null;
  let storedAuthState = cookieHelper.getAuthState() ? cookieHelper.getAuthState() : null;

  if (authState === null || authState !== storedAuthState) {
    console.log('state mismatch');
    let protocol = 'http://';
    let url = req.headers['host'];


    res.writeHead(302, {
      'Content-Type': 'text/html',
      Location: protocol + url + '/#' + qs.stringify({
        error: 'state_mismatch'
      })
    });

    res.end();
    return; //Need this to stop it from continuing after if.
  }

  // Delete state cookie after correctly matching.
  cookieHelper.deleteAuthState();

  const postData = {
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: REDIRECT_URI
  };

  const axiosOptions = {
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET, 'utf8').toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  let spotifyResponse = await axios.post('https://accounts.spotify.com/api/token', qs.stringify(postData), axiosOptions);
  let data = spotifyResponse.data;
  const { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = data;

  cookieHelper.setAccessToken(accessToken, expiresIn);
  cookieHelper.setRefreshToken(refreshToken);

  let protocol = 'http://';
  let url = req.headers['host'];

  res.writeHead(302, {
    Location: protocol + url,
    'Content-Type': 'text/html',
  });

  res.end();
}
