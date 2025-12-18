<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import type { ActionData, PageServerData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	onMount(() => {
		if (form?.success) {
			window.location.href = '/';
		}
	});
</script>

{#if data.invalidCode}
	<p>The requested magic link is invalid.</p>
{:else}
	<form method="post" action="?/signup" use:enhance>
		<h1>Please sign up to access your organisation</h1>

		<input type="password" placeholder="Password" name="password" />
		<input type="password" placeholder="Confirm Password" name="confirm-password" />
		<button>Signup</button>
	</form>
{/if}
