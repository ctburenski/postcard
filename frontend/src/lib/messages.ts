import { writable } from "svelte/store";

let messages = writable([]);

export { messages };