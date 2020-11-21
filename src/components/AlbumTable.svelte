<script>
  import { albumStore } from '../stores';
  import AlbumRow from './AlbumRow.svelte';
</script>

<style lang="postcss">
  th {
    text-align: left;
  }
</style>

<div>
  <table class="table-fixed">
    <tr class="bg-green-300 text-green-700">
      <th class="w-4/12">Name</th>
      <th class="w-4/12">Artist</th>
      <th class="w-2/12">Released</th>
      <th class="w-2/12">Saved</th>
    </tr>
    {#each $albumStore as albumData}
      <AlbumRow albumData={albumData} />
    {/each}
  </table>
</div>
