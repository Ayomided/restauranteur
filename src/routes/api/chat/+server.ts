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
	'Sesame'
] as const;

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
					content:
						'You are a helpful restaurant server. Only use the schema to construct the users search'
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
