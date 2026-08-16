/** The two host routes this plugin talks to. */
export async function postRoute(path, body) {
	const res = await fetch(path, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(body)
	});
	let data = {};
	try {
		data = await res.json();
	} catch (error) {
		data = {};
	}
	return data;
}
