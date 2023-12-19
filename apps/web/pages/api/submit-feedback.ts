/* eslint-disable import/no-anonymous-default-export */
export default async function (req, res) {
	const feedbackText: string = req.body.feedbackText;
	const userEmail: string = req.body.userEmail;
	const PRODUCTLANE_API_KEY = process.env.PRODUCTLANE_API_KEY;

	console.log(feedbackText);
	console.log(userEmail);

	const response = await fetch('https://productlane.com/api/v1/insights', {
		method: 'POST',
		headers: {
			Authorization: 'Bearer ' + PRODUCTLANE_API_KEY,
			'Content-Type': 'application/json',
		},
		// body: `{"contactEmail": ${userEmail},"painLevel":"UNKNOWN","text":${feedbackText}}`,
		body: `{"contactEmail":"${userEmail}","painLevel":"UNKNOWN","text":"${feedbackText}","origin":"API_KEY_USER","notify":{"email":true,"slack":true}}`,
	});

	const data = await response.json();

	console.log(response);

	res.status(200).json({ response: data });
}
