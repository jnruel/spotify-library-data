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

  export let accessToken, numAlbums;
  let albumsData;
  let disabled = false;
  let blobUrl;
  let last_updated;

  if (process.browser) {
    albumStore.useLocalStorage();
    userStore.useLocalStorage();
  }

  userStore.subscribe(userStore => {
    if (userStore.albums.last_updated) {
      last_updated = format(new Date(userStore.albums.last_updated), 'Pp');
    }
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

    disabled = false;
  };

  const prepareBlobUrl = async () => {
    blobUrl = await saveJson($albumStore);
  };
</script>

<style lang="postcss">
  button {
    @apply bg-green-800 text-green-300 border border-green-800;
    padding: 10px;
  }

  button:disabled, button:disabled:hover {
    @apply bg-gray-400 text-gray-700;
    cursor: not-allowed;
  }

  button:hover {
    @apply bg-green-300 text-green-800;
  }
</style>

<svelte:head>
  <title>Albums</title>
</svelte:head>

<h1 class="text-2xl">Saved Albums</h1>

{#if last_updated} <div>Last Updated: {last_updated}</div> {/if}

<button on:click={handleClick} {disabled}>
  Sync saved albums {#if numAlbums !== null} ({numAlbums}) {/if}
</button>

{#if $albumStore.length > 0}
  <button on:click={prepareBlobUrl}>Prepare for export</button>
  {#if blobUrl}
    <a download="saved-albums.json" href={blobUrl}>Export albums as JSON</a>
  {/if}
{/if}


<AlbumTable />

