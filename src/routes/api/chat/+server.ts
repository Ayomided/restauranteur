import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { json, type RequestHandler } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';

const DietaryCategories = [
	'Vegetarian',
	'Vegan',
	'Gluten-Free',
	'Paleo',
	'Keto',
	'Nut-Free',
	'Dairy-Free',
	'Halal',
	'Kosher',
	'Low-FODMAP',
	'Spicy',
	'Pescatarian',
	'Lacto-Vegetarian',
	'Ovo-Vegetarian',
	'Pollotarian',
	'Flexitarian',
	'Raw Vegan',
	'Fruititarian',
	'Whole30',
	'Sugar-Free',
	'Low-Carb',
	'Low-Sodium',
	'Low-Fat',
	'Mediterranean',
	'High-Protein',
	'Low-Calorie',
	'Diabetic-Friendly',
	'Carnivore',
	'Macrobiotic',
	'No-Added-Sugar',
	'Egg-Free',
	'Soy-Free',
	'Organic',
	'Plant-Based',
	'Nightshade-Free',
	'Lectin-Free',
	'Probiotic-Rich',
	'Fermentation-Based',
	'Ayurvedic',
	'Other'
] as const;

const Allergies = [
	'Peanuts',
	'Tree Nuts',
	'Dairy',
	'Eggs',
	'Gluten',
	'Soy',
	'Fish',
	'Shellfish',
	'Wheat',
	'Sesame',
	'Corn',
	'Mustard',
	'Legumes',
	'Sulphites',
	'Lupin',
	'Citrus',
	'Celery',
	'Garlic',
	'Onion',
	'Tomatoes',
	'Nightshades',
	'Strawberries',
	'Chocolate',
	'Bananas',
	'Avocados',
	'Kiwi',
	'Pineapple',
	'Mango',
	'Coconut'
] as const;

export type DietaryCategory = (typeof DietaryCategories)[number];
export type Allergy = (typeof Allergies)[number];

const DietaryRestriction = z.object({
	dietaryCategories: z.array(z.enum(DietaryCategories)),
	allergies: z.array(z.enum(Allergies))
});

const dietarySchema = z.object({
	DietaryRestriction
});

export type DietraySchema = z.infer<typeof dietarySchema>;

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { message }: { message: string } = await request.json();

		const client = new OpenAI({ apiKey: OPENAI_API_KEY });

		const response = await client.beta.chat.completions.parse({
			model: 'gpt-4o-2024-08-06',
			messages: [
				{
					role: 'system',
					content: `
					You are a helpful restaurant server. You will assist the user in filtering menu items based on dietary restrictions and allergies. You should construct the user's query using only the provided dietary categories and allergies schema.

					When constructing the response:
					- If the user mentions specific dietary needs (e.g., vegetarian, gluten-free), match them with the available categories.
					- If the user mentions an allergy (e.g., peanuts, dairy), include it from the allergy schema.
					- If the user mentions dietary preferences not listed (e.g., "organic"), respond with "Other".

					The available dietary categories are: Vegetarian, Vegan, Gluten-Free, Paleo, Keto, Nut-Free, Dairy-Free, Halal, Kosher, Low-FODMAP, Spicy, Pescatarian, Other.
					The available allergies are: Peanuts, Tree Nuts, Dairy, Eggs, Gluten, Soy, Fish, Shellfish, Wheat, Sesame.

					Only use the schema to construct the user's query.`
				},
				{
					role: 'user',
					content: message
				}
			],
			response_format: zodResponseFormat(dietarySchema, 'dietaryRestriction')
		});

		const responseContent = response.choices[0]?.message;
		if (responseContent?.parsed) {
			return json({ reply: responseContent.parsed });
		} else {
			throw new Error('No response content');
		}
	} catch (error) {
		console.error('Error:', error);
		return json({ error: 'An error occurred while processing your request.' }, { status: 500 });
	}
};
