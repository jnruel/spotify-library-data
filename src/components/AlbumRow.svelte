<script>
  import { format, parseISO } from 'date-fns';
  export let albumData;

  // Formatted like: 01/01/2020 5:00 PM
  let saved_date = format(parseISO(albumData.added_at), 'P');
  let release_date = format(parseISO(albumData.album.release_date), 'P');

  let artists = '';

  // Build artists string if album has more than 1 artist.
  albumData.album.artists.forEach((artist, index) => {
    if (index !== 0) {
      artists += ', ';
    }

    artists += artist.name;
  });
</script>

<tr>
  <td>{albumData.album.name}</td>
  <td>{artists}</td>
  <td>{release_date}</td>
  <td>{saved_date}</td>
</tr>
