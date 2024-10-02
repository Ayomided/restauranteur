<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { restaurants, searchInput, searchRestaurants } from './restaurantSearchLogic';
	import { browser } from '$app/environment';

	function initMap(element: HTMLElement) {
		import('./restaurantSearchLogic').then((module) => {
			module.initializeMap(element);
		});
	}

	function handleSearchRestaurant() {
		searchRestaurants($searchInput);
	}
</script>

<div class="p-24">
	<div class="text-sm text-gray-500">🥘🍚</div>
	<h1 class="text-3xl font-bold text-slate-800">Restauranteur</h1>
	<p>Let's take your dietary restrictions and find the perfect restaurant experience for you!</p>
	<form on:submit={handleSearchRestaurant} class="flex flex-col gap-4 pb-5 pt-5">
		<input
			bind:value={$searchInput}
			type="text"
			placeholder="Walk us through your prefences"
			class="w-full rounded-md p-4 ring-2 ring-slate-400 hover:ring-slate-800 focus-visible:ring-slate-800"
		/>
		<Button type="submit" class="md:max-w-48">Curate Restaurants</Button>
	</form>
	<div class="flex flex-col gap-4">
		{#if browser}
			<div use:initMap style="height: 400px; width: 100%;"></div>
		{/if}
		<!-- <p class="text-pretty text-red-800">
			{$place.name}
		</p> -->
		<ul>
			{#each $restaurants as restaurant}
				<li>{restaurant.name} - {restaurant.formatted_address}</li>
			{/each}
		</ul>
	</div>
</div>
