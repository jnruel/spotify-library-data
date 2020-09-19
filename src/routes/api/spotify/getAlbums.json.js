import { CookieHelper } from '../../../util/auth';
const axios = require('axios');

export async function get(req, res) {
  let cookieHelper = new CookieHelper(req, res);
  const accessToken = cookieHelper.getAccessToken();

  res.setHeader('Content-Type', 'application/json');

  try {
    let spotifyResponse = await axios.get('https://api.spotify.com/v1/me/albums', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });
    // res.status(200).send(spotifyResponse.data);
    res.end(JSON.stringify(spotifyResponse.data));
  }
  catch(error) {
    // Todo: handle and set status from error.response.data.status:
    // res.status(400).send(error.response.data);
    res.end(JSON.stringify(error.response.data))
  }
}
