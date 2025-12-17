<script lang="ts">
	import { enhance } from '$app/forms';

	let {
		username,
		roles
	}: { username: string; roles: { role: { id: number; name: string }; user: string }[] } = $props();

	let isAdmin = $state(false);

	$effect(() => {
		for (let role of roles) {
			if (role.role.name === 'admin') {
				isAdmin = true;
				break;
			}
		}
	});
</script>

<div class="mb-4 flex h-12 items-center justify-between bg-indigo-800 p-4 text-white">
	<nav>
		<a href="/">Home</a>
	</nav>

	<div class="flex gap-4">
		<span>Hello, {username}</span>
		<form action="/?/logout" method="post" use:enhance>
			<button class="cursor-pointer font-bold">Logout</button>
		</form>
		{#if isAdmin}
			Admin
		{/if}
	</div>
</div>
