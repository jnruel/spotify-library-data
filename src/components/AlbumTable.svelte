<script>
  import { albumStore } from '../stores';
  import AlbumRow from './AlbumRow.svelte';
</script>

<style lang="postcss">
  th {
    text-align: left;
    padding-bottom: 6px;
  }
  table {
    @apply text-green-800;
    height: 500px;
  }
</style>

<div class="table-container">
  <table>
    <thead>
      <tr class="bg-green-300 text-green-900">
        <th class="w-4/12">Name</th>
        <th class="w-4/12">Artist</th>
        <th class="w-2/12">Released</th>
        <th class="w-2/12">Saved</th>
      </tr>
    </thead>
    <tbody>
      {#each $albumStore as album}
        <AlbumRow album={album} />
      {/each}
    </tbody>
  </table>
</div>
