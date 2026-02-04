import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadSave } from '$lib/server/save-manager';

export const GET: RequestHandler = async () => {
	const save = loadSave();

	// Format date for filename: YYYY-MM-DD
	const date = new Date().toISOString().split('T')[0];
	const filename = `speech-path-clinic-save-${date}.json`;

	return new Response(JSON.stringify(save, null, 2), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Content-Disposition': `attachment; filename="${filename}"`,
			'Cache-Control': 'no-cache'
		}
	});
};
