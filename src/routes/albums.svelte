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
  import { userStore, albumStore } from '../stores';
  import AlbumTable from '../components/AlbumTable.svelte';
  import { format } from 'date-fns';
  import {onMount} from 'svelte';

  export let accessToken, numAlbums;
  let albumsData;
  let disabled = false;
  let downloadBlobUrl;
  let last_updated = '?';

  if (process.browser) {
    albumStore.useLocalStorage();
    userStore.useLocalStorage();
  }

  onMount(async () => {
    last_updated = format(new Date($userStore.albums.last_updated), 'Pp');
  });


  const handleClick = async () => {
    disabled = true;
    albumsData = await getAllAlbums(accessToken);
    albumStore.set(albumsData);

    userStore.update(userStore => {
      let newUserStore = Object.assign({}, userStore);
      newUserStore.albums.last_updated = new Date().toISOString();
      return newUserStore;
    });

    // downloadBlobUrl = await saveJson(albumsData);
    disabled = false;
  };
</script>

<svelte:head>
  <title>Albums</title>
</svelte:head>

<h1>Saved Albums</h1>
<div>Last Updated: {last_updated}</div>
<button on:click={handleClick} {disabled}>Sync saved albums {#if numAlbums !== null} ({numAlbums}) {/if}</button>
<!-- {#if downloadBlobUrl}
  <a download="saved-albums.json" href={downloadBlobUrl}>Download albums JSON</a>
{/if} -->

<AlbumTable />

