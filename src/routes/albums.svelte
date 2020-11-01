<script context="module">
  import { albumStore } from '../stores';
  import { getAlbums } from '../util/requests';

  if (process.browser) {
    albumStore.useLocalStorage();
  }

  export async function preload(page, session) {
    let response = await this.fetch(
      '/api/spotify/getAlbums.json', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    });

    let data = await response.json();
    console.log(data.total + ' albums');
  }

  const syncAlbums = async () => {
    let albumsData = await getAlbums();
    console.log(albumsData);
  };
</script>

<svelte:head>
	<title>Albums</title>
</svelte:head>

<h1>Saved Albums</h1>

<button on:click={syncAlbums}>Sync albums</button>
