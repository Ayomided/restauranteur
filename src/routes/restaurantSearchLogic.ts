import { writable, type Writable, get } from 'svelte/store';
import type { Loader } from '@googlemaps/js-api-loader';

export type Restaurant = google.maps.places.PlaceResult;

export const restaurants: Writable<Restaurant[]> = writable([]);
export const searchInput: Writable<string> = writable('');

let placesService: google.maps.places.PlacesService;

export async function initializeMap(element: HTMLElement): Promise<void> {
	const { Loader } = await import('@googlemaps/js-api-loader');
	const loader: Loader = new Loader({
		apiKey: 'AIzaSyA6zJPCaA_mRZMV02fOyyhgImKHfjLYMNw',
		version: 'weekly'
	});

	await loader.importLibrary('places');
	const map = new google.maps.Map(element, {
		center: { lat: 40.7128, lng: -74.006 },
		zoom: 13
	});

	placesService = new google.maps.places.PlacesService(map);
}

export function searchRestaurantsDetails(placeId: string, index: number): void {
	if (!placesService) return;

	const request: google.maps.places.PlaceDetailsRequest = {
		placeId: placeId
	};

	placesService.getDetails(
		request,
		(
			results: google.maps.places.PlaceResult | null,
			status: google.maps.places.PlacesServiceStatus
		) => {
			if (status === google.maps.places.PlacesServiceStatus.OK && results) {
				const currentRestaurants = get(restaurants);

				if (currentRestaurants[index]) {
					currentRestaurants[index] = {
						...currentRestaurants[index],
						...results
					};

					restaurants.set(currentRestaurants);
				}
			}
		}
	);
}

export function searchRestaurants(query: string): void {
	if (!placesService) return;

	const request: google.maps.places.TextSearchRequest = {
		query,
		type: 'restaurant'
	};

	placesService.textSearch(
		request,
		(
			results: google.maps.places.PlaceResult[] | null,
			status: google.maps.places.PlacesServiceStatus
		) => {
			if (status === google.maps.places.PlacesServiceStatus.OK && results) {
				restaurants.set(results);
				results.forEach((restaurant, index) => {
					if (restaurant.place_id) {
						searchRestaurantsDetails(restaurant.place_id, index);
					}
				});
			}
		}
	);
}
