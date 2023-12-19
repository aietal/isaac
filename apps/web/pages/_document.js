import Document, { Head, Html, Main, NextScript } from 'next/document';
//
// const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
	render() {
		return (
			<Html>
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
