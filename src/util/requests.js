const fetchOpts = {
  method: 'GET',
  headers: {'Content-Type': 'application/json'}
};

export const getAlbums = async (dataType, offset) => {

  try {
    let response = await fetch(
      '/api/spotify/getAlbums.json', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    });

    const data = await response.json();
    return data;
  }
  catch(error) {
    console.error(error);
  }

  // // If error
  // if (!response.ok) {
  //   console.log(response);
  //   throw new Error(response.status);
  // }

  // return await response.json();
}
