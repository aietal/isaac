import * as React from 'react';

export const EmailTemplate = () => (
	<div>
		<p>Hey there 👋</p>
		<p>I hope this message finds you well. </p>
		<p>
			{' '}
			I wanted to take a moment to personally thank you for signing up for
			Isaac! You&apos;re awesome. Seriously. 😊
		</p>
		<p>
			If you have any questions about the product or our subscription plans,
			please don&apos;t hesitate to respond to this email.
		</p>
		<p>
			Best, <br />
			Eimen{' '}
		</p>
		<p>----</p>
		<div>
			<p>
				Founder and CEO <br />
				Isaac by AI et al, Inc. <br />
				{/* <a href="https://aietal.com" target="_blank" rel="noreferrer">
          www.aietal.com
        </a> */}
			</p>
		</div>
		{/* <br />
		<br /> */}
		{/* <span>
      PS: If you&apos;re not able to afford a subscription, also respond this
      email and we&apos;ll figure something out! 💪{' '}
    </span> */}
	</div>
);
