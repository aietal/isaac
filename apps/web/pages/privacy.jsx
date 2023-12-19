import Head from 'next/head';
import React from 'react';
import { Header } from '../components/landing/Header';

function Privacy() {
	return (
		<>
			<Head>
				<title>Isaac Editor - Privacy Policy</title>
				<meta
					property="og:title"
					content="Isaac Editor - AI-first Text Editor For Academic Writing"
					key="title"
				/>
				{/* TODO: Need to Put more description here
          Please follow the guidelines
          https://developer.chrome.com/docs/lighthouse/seo/meta-description/?utm_source=lighthouse&utm_medium=lr#meta-description-best-practices
      */}
				<meta
					name="description"
					content="Isaac Editor - AI-first Text Editor For Academic Writing"
				/>
			</Head>
			<div className="flex flex-col min-h-screen bg- overflow-hidden">
				{/*  Site header */}

				<Header />

				{/*  Page content */}
				<main className="grow ">
					{/*  Page illustration */}

					<section className="relative ">
						<div className="max-w-6xl mx-auto px-4  sm:px-6 relative">
							<div className="pt-32 pb-12 md:pt-40 md:pb-20">
								{/* Create a privacy policy section  */}
								<div className="max-w-3xl mx-auto pb-12 md:pb-16 flex flex-col gap-2">
									<h1 className="h1 text-stone-700 mb-4">Privacy Policy</h1>
									<div className="text-xl text-stone-500 pt-5 prose ">
										<p>
											This privacy policy relates to the https://isaaceditor.com
											website operated by AI et al, Inc. for the Isaac Editor
											product. This policy was last updated on 5/22/2023.
										</p>
										<h2>Collection of Personal Information</h2>
										<p>
											We may collect and store personal information such as your
											name and email address when you register for an account on
											our website or subscribe to our newsletter. We may also
											collect information about your use of our website, such as
											your IP address and browser information.
										</p>
										<h2>Use of Personal Information</h2>
										<p>
											We may use your personal information to provide you with
											the products and services you have requested, to
											communicate with you about our products and services, and
											to improve our website and services. We may also use your
											personal information to personalize and improve your
											experience on our website.
										</p>
										<h2>Sharing of Personal Information</h2>
										<p>
											We may share your personal information with third-party
											service providers who perform services on our behalf, such
											as hosting and email delivery. We do not share your
											personal information with third parties for their
											marketing purposes.
										</p>
										<h2>Security of Personal Information</h2>
										<p>
											We take reasonable measures to protect your personal
											information from unauthorized access, use, or disclosure.
											However, no method of transmission over the internet or
											electronic storage is 100% secure, and we cannot guarantee
											absolute security.
										</p>
										<h2>Changes to Privacy Policy</h2>
										<p>
											We may update this privacy policy from time to time. If we
											make material changes to this policy, we will notify you
											by email or by posting a notice on our website.
										</p>
										<h2>Contact Us</h2>
										<p>
											If you have any questions or concerns about our privacy
											policy, please contact us at{' '}
											<a href="mailto:info@isaaceditor.com">
												info@isaaceditor.com
											</a>
											.
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>
				</main>

				{/*  Site footer */}
			</div>
		</>
	);
}

export default Privacy;
