<script>
  import Nav from '../components/Nav.svelte';
  export let segment;
</script>

<style>
  main {
    @apply bg-green-300;
    position: relative;
    max-width: 56em;
    margin: 0 auto;

    padding: 2em;
    box-sizing: border-box;
  }
</style>

<Nav {segment}/>

<main>
  <slot></slot>
</main>
