<script context="module">
  export async function preload(page, session) {
    let numAlbums, thisToken;

    if (session.hasOwnProperty('access_token')) {
      thisToken = session.access_token;
    }
    else {
      // TODO: Handle if no token?
    }

    let response = await this.fetch(
      '/api/spotify/getAlbums.json', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    });

    let data = await response.json();

    if (data.hasOwnProperty('total')) {
      numAlbums = data.total;
    }

    return {
      numAlbums: numAlbums,
      accessToken: thisToken
    }
  }
</script>

<script>
  import { saveJson } from '../util/misc-helpers';
  import { getAllAlbums } from '../util/spotify-fetch-helpers';
  import { albumStore } from '../stores';
  import AlbumTable from '../components/AlbumTable.svelte';

  export let accessToken, numAlbums;
  let albumsData;
  let disabled = false;
  let downloadBlobUrl;

  if (process.browser) {
    albumStore.useLocalStorage();
  }

  const handleClick = async () => {
    disabled = true;
    albumsData = await getAllAlbums(accessToken);
    albumStore.set(albumsData);
    downloadBlobUrl = await saveJson(albumsData);
    disabled = false;
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

<AlbumTable />

