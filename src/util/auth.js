import dotenv from 'dotenv';
const config = dotenv.config();

export const {
  SPOTIFY_CLIENT_ID: CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI: REDIRECT_URI
} = process.env;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
export const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

export class CookieHelper {
  constructor(req, res) {
    const Cookies = require('cookies');
    this.cookies = new Cookies(req, res);
    this.cookieKeys = {
      authState: 'spotify-auth-state',
      accessToken: 'spotify-access-token',
      refreshToken: 'spotify-refresh-token'
    };
  }

  setAuthState(authState) {
    this.cookies.set(this.cookieKeys.authState, authState, {
      sameSite: 'strict', httpOnly: true
    });
  }

  setAccessToken(accessToken, expiresIn) {
    let date = new Date();
    date.setSeconds(date.getSeconds() + expiresIn);

    this.cookies.set(this.cookieKeys.accessToken, accessToken, {
      sameSite: 'strict',
      httpOnly: true,
      expires: date
    });
  }

  setRefreshToken(refreshToken) {
    this.cookies.set(this.cookieKeys.refreshToken, refreshToken, {
      sameSite: 'strict', httpOnly: true
    });
  }

  getAuthState() {
    return this.cookies.get(this.cookieKeys.authState);
  }

  getAccessToken() {
    return this.cookies.get(this.cookieKeys.accessToken);
  }

  getRefreshToken() {
    return this.cookies.get(this.cookieKeys.refreshToken);
  }

  deleteAuthState() {
    this.cookies.set(this.cookieKeys.authState);
  }
}
