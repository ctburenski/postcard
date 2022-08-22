import { writable, type Writable } from "svelte/store";

let loggedInAs: Writable<{ username: string, loggedInAt: Date } | null> = writable(null);
// let loggedInAs = writable(null);

export { loggedInAs };