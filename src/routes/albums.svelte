<script context="module">
  export function preload(page, session) {
    console.log(session);
  }

  const getAlbums = async () => {
    let response = await fetch(
      '/api/spotify/getAlbums.json', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    });

    let data = await response.json();

    console.log(data);
    return data;
  };
</script>

<svelte:head>
	<title>Albums</title>
</svelte:head>

<h1>Saved Albums</h1>

<button on:click={getAlbums}>Sync albums</button>
