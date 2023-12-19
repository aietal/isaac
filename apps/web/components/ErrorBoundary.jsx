import { buttonVariants } from '@components/ui/button';
import Image from 'next/image';
import Router from 'next/router';
import React from 'react';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
		this.resetError = this.resetError.bind(this);
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		console.log({ error, errorInfo });
	}

	async resetError() {
		await Router.push('/');
		this.setState({ hasError: false });
	}

	render() {
		if (this.state.hasError) {
			return (
				<section className="bg-white dark:bg-gray-900 ">
					<div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
						<div className="flex flex-col items-center max-w-xl mx-auto text-center">
							<p className="p-3 text-sm font-medium text-muted-foreground rounded-full dark:bg-gray-800">
								<Image
									src="/error-gif.gif"
									width={500}
									height={500}
									alt="Picture of the author"
								/>
							</p>
							<h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
								Oops. Something went wrong.
							</h1>

							<div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
								<button
									onClick={this.resetError}
									className={buttonVariants({
										variant: 'default',
									})}
								>
									Take me home
								</button>
							</div>
						</div>
					</div>
				</section>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
