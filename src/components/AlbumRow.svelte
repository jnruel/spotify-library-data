<script>
  import { format, parseISO } from 'date-fns';
  export let album;

  // Formatted like: 01/01/2020 5:00 PM
  // let saved_date = format(parseISO(album.added_at), 'P');
  // let release_date = format(parseISO(album.release_date), 'P');

  // Build artists string if album has more than 1 artist.
  let artists = '';
  album.artists.forEach((artist, index) => {
    if (index !== 0) {
      artists += ', ';
    }

    artists += artist.name;
  });
</script>

<style lang="postcss">
  td {
    @apply border border-green-500;
    padding: 6px 10px;
  }
</style>

<tr>
  <td>{album.name}</td>
  <td>
    {#each album.artists as artist, i}
      {artist.name}{#if album.artists.length !== i + 1}{', '}{/if}
    {/each}
  </td>
  <td>{format(parseISO(album.added_at), 'P')}</td>
  <td>{format(parseISO(album.release_date), 'P')}</td>
</tr>
