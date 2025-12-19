<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	let formMessage: string = $state('');
</script>

<h1>Organisation: {data.org?.name}</h1>

<section class="messages">
	{#if data.messages.length === 0}
		<p>No messages yet.</p>
	{:else}
		<ul>
			{#each data.messages as m}
				<li>
					<strong>{m.user.email}</strong> <small>at {new Date(m.createdAt).toLocaleString()}</small>
					<div>{m.content}</div>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<form method="post" action="?/postMessage" use:enhance>
	<input type="hidden" name="organisation" value={data.org.id} />
	<textarea
		name="content"
		bind:value={formMessage}
		placeholder="Write a message"
		class="w-full rounded-md"
	></textarea>
	<button class="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white">Post</button>
</form>
