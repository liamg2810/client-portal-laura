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

<hr class="my-4" />

<!-- Organisation creation -->
<h2>Create Organisation</h2>
<form method="post" action="?/createOrganisation" use:enhance>
	<input name="name" type="text" placeholder="Organisation name" class="rounded-md" />
	<button class="cursor-pointer rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
		>Create</button
	>
</form>

<hr class="my-4" />

<!-- Assign user to organisation -->
<h2>Assign User to Organisation</h2>
<form method="post" action="?/assignUser" use:enhance>
	<select name="user" class="rounded-md">
		<option value="">Select user</option>
		{#each data.users as u}
			<option value={u.user.id}>{u.user.email}</option>
		{/each}
	</select>

	<select name="organisation" class="rounded-md">
		<option value="">Select organisation</option>
		{#each data.orgs as o}
			<option value={o.id}>{o.name}</option>
		{/each}
	</select>

	<button class="cursor-pointer rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
		>Assign</button
	>
</form>

<hr class="my-4" />

<h2>Organisations</h2>
<ul>
	{#each data.orgs as o}
		<li><a href={`/org/${o.id}`}>{o.name}</a></li>
	{/each}
</ul>
