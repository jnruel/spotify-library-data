<script context="module">
  // import { albumStore } from '../stores';
  // import { getAlbums } from '../util/spotify-requests';

  // if (process.browser) {
  //   albumStore.useLocalStorage();
  // }

  export async function preload(page, session) {
    let numAlbums;
    let response = await this.fetch(
      '/api/spotify/getAlbums.json', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    });

    let data = await response.json();

    if (data.hasOwnProperty('total')) {
      numAlbums = data.total;
    }

    let thisToken = null;

    if (session.hasOwnProperty('access_token')) {
      thisToken = session.access_token;
    }

    return {
      numAlbums: numAlbums,
      accessToken: thisToken
    }
  }
</script>

<script>
  import { onMount } from 'svelte';

  export let accessToken, numAlbums;
  let albumsData;
  let disabled = false;
  let downloadBlobUrl;

  onMount(async () => {
    console.log(accessToken);
  });

  const getAllAlbums = async () => {
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
        // next = false;

        // Request the next page of data and push to array if it exists.
        if (responseJson.hasOwnProperty('next') && responseJson.next !== null) {
          requestUrl = responseJson.next;
          Array.prototype.push.apply(albums, responseJson.items);
        }
        else {
          next = false;
        }
      }
      catch(error) {
        // Todo: handle and set status from error.response.data.status:
        // res.end(JSON.stringify(error.response.data))
        console.error(error);
      }
    }

    // fetching = false;
    return albums;
  };

  const saveJson = async (obj) => {
    var str = JSON.stringify(obj);
    var data = encode(str);

    var blob = new Blob( [data], {
      type: 'application/json'
    });

    return URL.createObjectURL(blob);
  }

  var encode = function( s ) {
    var out = [];

    for ( var i = 0; i < s.length; i++ ) {
      out[i] = s.charCodeAt(i);
    }

	  return new Uint8Array( out );
  }

  const handleClick = async () => {
    disabled = true;
    albumsData = await getAllAlbums();
    downloadBlobUrl = await saveJson(albumsData);
    disabled = false;
    console.log(albumsData);
  };
</script>

<svelte:head>
  <title>Albums</title>
</svelte:head>

<h1>Saved Albums</h1>

<button on:click={handleClick} {disabled}>Prepare albums for download {#if numAlbums !== null} ({numAlbums}) {/if}</button>
{#if downloadBlobUrl}
  <a download="saved-albums.json" href={downloadBlobUrl}>Download albums JSON</a>
{/if}

