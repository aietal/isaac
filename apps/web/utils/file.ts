export function dataURLtoFile(dataURL: string, filename: string) {
	// Split the dataURL to get the MIME type and the base64 data
	const [mime, base64Data] = dataURL.split(';base64,');

	// Convert the base64 data to binary data
	const binaryData = atob(base64Data);

	// Create a Uint8Array from the binary data
	const uint8Array = new Uint8Array(binaryData.length);
	for (let i = 0; i < binaryData.length; i++) {
		uint8Array[i] = binaryData.charCodeAt(i);
	}

	// Create a Blob from the Uint8Array and the MIME type
	const blob = new Blob([uint8Array], { type: mime });

	// Create a new File object from the Blob
	const file = new File([blob], filename, { type: mime });

	return file;
}
