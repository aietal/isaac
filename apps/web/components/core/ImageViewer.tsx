import Image from 'next/image';

export default function ImageViewer({ path }) {
	return (
		<Image
			src={path}
			alt="upload"
			width={500}
			height={500}
			layout="responsive"
			className="w-full h-full"
		/>
	);
}
