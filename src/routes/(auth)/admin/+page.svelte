<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import type { ActionData, PageServerData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	let linkElem: HTMLElement | undefined = $state();

	function Copy() {
		if (!linkElem) {
			return;
		}

		navigator.clipboard.writeText(linkElem.textContent);
	}
</script>

<form method="post" action="?/createUser" use:enhance>
	<input name="email" type="email" placeholder="New user email" class="rounded-md" />
	<!-- <input type="password" name="password" /> -->
	<button class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
		>Submit</button
	>
</form>

<p style="color: red">{form?.message ?? ''}</p>

{#if form?.code}
	<div class="flex flex-col gap-2 py-4">
		<hr />

		<div class="flex items-center gap-4">
			<p>
				Magic link created: <span bind:this={linkElem}>{page.url.host}/onboarding/{form.code}</span>
			</p>
			<button
				onclick={Copy}
				class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				>Copy to clipboard</button
			>
		</div>

		<hr />
	</div>
{/if}

Current Users:

<table>
	<thead class="bg-slate-300">
		<tr class="border">
			<th class="border-r">Email</th>
			<th class="px-4">Role</th>
		</tr>
	</thead>

	<tbody class="w-full bg-slate-50">
		{#each data.users as user}
			<tr>
				<td class="border px-4">{user.user.email}</td>
				<td class="border px-2 text-center">{user.role.name}</td>
			</tr>
		{/each}
	</tbody>
</table>
