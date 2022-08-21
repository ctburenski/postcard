<script>
	import Register from './Register.svelte';
	import Login from './Login.svelte'
	let loginSelected = false;
</script>

{#if loginSelected}
	<Login />
{:else}
	<Register />
{/if}
