export const getAllAlbums = async (accessToken) => {
  let albums = [];
  let next = true;
  let requestUrl = 'https://api.spotify.com/v1/me/albums?limit=50';

  while(next) {
    try {
      let response = await fetch(requestUrl, {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + accessToken}
      });

      let responseJson = await response.json();

      // Uncomment below for debugging purposes
      // to not loop through all pages each time.
      // next = false;

      // Request the next page of data and push to array if it exists.
      if (responseJson.hasOwnProperty('next') && responseJson.next !== null) {
        // If response has a next page URL set it.
        requestUrl = responseJson.next;

        for (const albumItem of responseJson.items) {
          let prunedAlbum = await pruneObject(albumItem.album, albumPropsBlacklist);
          prunedAlbum.added_at = albumItem.added_at;
          albums.push(prunedAlbum);
        }
      }
      else {
        // If no next page, stop the loop.
        next = false;
      }
    }
    catch(error) {
      console.error(error);
    }
  }

  return albums;
};

const albumPropsBlacklist = [
  'available_markets',
  'copyrights',
  'tracks',
  'external_ids'
];

const pruneObject = async (obj, blacklist) => {
  for (const prop of blacklist) {
    if (obj.hasOwnProperty(prop)) {
      delete obj[prop];
    }
  }

  return obj;
}
