import { writable, type Writable } from 'svelte/store';

let messages: Writable<{ username: string; message: string }[]> = writable([]);

export { messages };
