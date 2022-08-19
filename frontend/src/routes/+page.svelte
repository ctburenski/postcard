<script lang="ts">
	import { onMount } from 'svelte';

	let message: string;

	onMount(async () => {
		const result = await fetch('/api');
		message = await result.text();
	});
</script>

<h1>Hello!</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{#if message}
	<p>{message}</p>
{/if}
