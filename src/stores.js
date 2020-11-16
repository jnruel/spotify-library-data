import { writable } from 'svelte/store';

const createWritableStore = (key, startValue) => {
  const { subscribe, set, update } = writable(startValue);

	return {
    subscribe,
    set,
    update,
    useLocalStorage: () => {
      const json = localStorage.getItem(key);

      if (json) {
        set(JSON.parse(json));
      }

      subscribe(current => {
        localStorage.setItem(key, JSON.stringify(current));
      });
    }
  };
}

export const albumStore = createWritableStore('albumStore', []);
export const playlistStore = createWritableStore('playlistStore', []);
export const userStore = createWritableStore('userStore', {
  'albums': {
    'last_updated': null
  },
  'playlists': {
    'last_updated': null
  }
});
