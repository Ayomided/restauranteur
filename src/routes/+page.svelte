<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { restaurants, searchRestaurants } from './restaurantSearchLogic';
	import { browser } from '$app/environment';
	import type { DietraySchema, Allergy, DietaryCategory } from './api/chat/+server';
	import RestaurantCard from './RestaurantCard.svelte';

	interface ChatMessage {
		role: 'user' | 'assistant';
		content: string | DietraySchema;
	}

	function initMap(element: HTMLElement) {
		import('./restaurantSearchLogic').then((module) => {
			module.initializeMap(element);
		});
	}

	let message = '';
	let chat: ChatMessage[] = [];
	let allergies: Allergy[];
	let dietaryCategory: DietaryCategory[];

	async function handleSendRestrictions() {
		if (message === '') return;
		chat = [...chat, { role: 'user', content: message }];
		const userMessage: string = message;
		message = '';

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ message: userMessage })
			});

			if (!response.ok) {
				throw new Error('Failed to get response from server');
			}

			const data: { reply: string } = await response.json();
			chat = [...chat, { role: 'assistant', content: data.reply }];
			return data;
		} catch (error) {
			console.error('Error:', error);
			chat = [
				...chat,
				{ role: 'assistant', content: 'Sorry, an error occurred. Please try again.' }
			];
		}
	}

	async function handleSearchRestaurant() {
		const restrictions = await handleSendRestrictions();
		const pout = JSON.stringify(restrictions?.reply);
		const parsedRestrictions = JSON.parse(pout) as DietraySchema;
		allergies = parsedRestrictions.DietaryRestriction.allergies;
		dietaryCategory = parsedRestrictions.DietaryRestriction.dietaryCategories;
		console.log(`${dietaryCategory} | ${allergies}`);
		searchRestaurants(
			`Restaurant with ${dietaryCategory} meals and with ${allergies} restrictions`
		);
	}
</script>

<div class="p-24">
	<div class="text-sm text-gray-500">🥘🍚</div>
	<h1 class="text-3xl font-bold text-slate-800">Restauranteur</h1>
	<p>Let's take your dietary restrictions and find the perfect restaurant experience for you!</p>
	<form on:submit|preventDefault={handleSearchRestaurant} class="flex flex-col gap-4 pb-5 pt-5">
		<input
			bind:value={message}
			type="text"
			placeholder="Walk us through your prefences"
			class="w-full rounded-md p-4 ring-2 ring-slate-400 hover:ring-slate-800 focus-visible:ring-slate-800"
		/>
		<Button type="submit" class="md:max-w-48">Curate Restaurants</Button>
	</form>

	<div>
		{#if allergies && dietaryCategory}
			Your Preferences
			<p>
				{allergies}
			</p>
			<p>
				{dietaryCategory}
			</p>
		{/if}
	</div>

	<div class="flex flex-col gap-4">
		{#if browser}
			<div use:initMap style="height: 400px; width: 100%;"></div>
		{/if}
		<ul>
			{#each $restaurants as restaurant}
				{restaurant.website}
				<RestaurantCard
					restaurantName={restaurant.name}
					restaurantAddress={restaurant.formatted_address}
					restaurantRating={restaurant.rating}
				/>
			{/each}
		</ul>
	</div>
</div>
