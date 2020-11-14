<script>
  export let albumData;
</script>

<tr>
  <td>{albumData.album.name}</td>
  <td>{albumData.album.artists[0].name}</td>
  <td>{albumData.added_at}</td>
</tr>
