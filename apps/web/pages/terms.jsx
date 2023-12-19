import Head from 'next/head';
import React from 'react';
import { Footer } from '../components/landing/Footer';
import { Header } from '../components/landing/Header';

function Privacy() {
	return (
		<>
			<Head>
				<title>Isaac Editor - Terms Of Conditions</title>
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
				<main className="bg-gray-50 ">
					{/*  Page illustration */}

					<section className="relative ">
						<div className="max-w-6xl mx-auto px-4  sm:px-6 relative">
							<div className="pt-32 pb-12 md:pt-40 md:pb-20">
								{/* Create a privacy policy section  */}
								<div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
									<h1 className="h1 text-stone-700 mb-4">
										Terms of Conditions
									</h1>
									<div className="flex flex-col gap-2 text-xl text-stone-500 pt-5 prose ">
										<p>
											Introduction These terms of service govern your use of our
											website and SaaS service. By using our website and SaaS
											service, you agree to be bound by these terms of service.
										</p>

										<p>
											Use of Service You may only use our website and SaaS
											service for lawful purposes and in accordance with these
											terms of service. You are responsible for any activity
											that occurs under your account.
										</p>

										<p>
											Intellectual Property Our website and SaaS service contain
											content that is owned or licensed by us, including text,
											images, code, and software. This content is protected by
											copyright, trademark, and other laws. You may not use our
											content without our permission.
										</p>

										<p>
											Termination We reserve the right to terminate your account
											or your use of our website and SaaS service at any time,
											with or without notice, for any reason or no reason.
										</p>

										<p>
											Warranty Disclaimer Our website and SaaS service are
											provided &quot;as is&quot; and &quot;as available&quot;
											without any warranty of any kind, express or implied. We
											do not guarantee that our website or SaaS service will be
											uninterrupted or error-free.
										</p>

										<p>
											Limitation of Liability In no event shall we be liable for
											any damages whatsoever, including but not limited to any
											direct, indirect, special, incidental, or consequential
											damages, arising out of or in connection with the use or
											inability to use our website or SaaS service.
										</p>

										<p>
											Changes to these terms We reserve the right to modify
											these terms of service from time to time, and will post
											the new terms of service on our website. Your continued
											use of our website and SaaS service following the posting
											of new terms of service will be deemed acceptance of those
											changes.
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>
				</main>

				<Footer />

				{/*  Site footer */}
			</div>
		</>
	);
}

export default Privacy;
