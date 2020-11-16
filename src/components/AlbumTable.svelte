<script>
  import { albumStore } from '../stores';
  import AlbumRow from './AlbumRow.svelte';
</script>

<div class="album-table-wrapper">
  <table>
    <tr>
      <th>Name</th>
      <th>Artist</th>
      <th>Released</th>
      <th>Saved</th>
    </tr>
    {#each $albumStore as albumData}
      <AlbumRow albumData={albumData} />
    {/each}
  </table>
</div>
