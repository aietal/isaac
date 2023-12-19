import puppeteer from 'puppeteer';

export default async function handler(req, res) {
	// Get HTML and format from request body
	const { html, format } = req.body;

	// Generate custom styles based on format
	let customCss;
	switch (format) {
		case 'format1':
			customCss = `
      @page {
        size: A4;
        margin: 30mm;
      }
      @page::after {
        content: counter(page);
        position: absolute;
        top: 0;
        right: 0;
        margin: 30mm;
      }
      .editor-heading-h1 {
        font-family: 'Times New Roman', Times, serif;
        font-size: 30pt;
        margin-top: 0;
        margin-bottom: 24pt;
        text-align: center;
      }
      .editor-heading-h2 {
        font-family: 'Times New Roman', Times, serif;
        font-size: 24pt;
        margin-top: 0;
        margin-bottom: 16pt;
        text-align: center;
      }
      .editor-heading-h3 {
        font-family: 'Times New Roman', Times, serif;
        font-size: 18pt;
        margin-top: 0;
        margin-bottom: 12pt;
        text-align: center;
      }
      .editor-heading-h4 {
        font-family: 'Times New Roman', Times, serif;
        font-size: 16pt;
        margin-top: 0;
        margin-bottom: 8pt;
        text-align: center;
      }
      .editor-heading-h5 {
        font-family: 'Times New Roman', Times, serif;
        font-size: 14pt;
        margin-top: 0;
        margin-bottom: 6pt;
        text-align: center;
      }
      .editor-paragraph {
        font-family: 'Times New Roman', Times, serif;
        font-size: 12pt;
        text-align: justify;
        margin-top: 0;
        margin-bottom: 12pt;
        text-indent: 50px;
      }
      .editor-text-bold {
        font-weight: bold;
      }
      .editor-text-italic {
        font-style: italic;
      }
      .editor-text-underline {
        text-decoration: underline;
      }
      .editor-list-ol {
        padding: 0;
        margin: 0;
        margin-left: 16px;
      }

      .editor-list-ul {
        padding: 0;
        margin: 0;
        margin-left: 16px;
      }

      .editor-listitem {
        margin: 8px 32px 8px 32px;
      }

      .editor-nested-listitem {
        list-style-type: none;
      }
      `;
			break;
		case 'format2':
			customCss = `
        // Add your custom styles for format2
      `;
			break;
		// Include other formats as necessary
	}
	// todo: change it to be based on env
	const browser = await puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
		executablePath: '/usr/bin/google-chrome',
	});
	const page = await browser.newPage();

	// Insert custom CSS into the HTML
	const fullHtml = `
  <html>
    <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.0/katex.min.css">
      <style>
      ${customCss}
      </style>
    </head>
    <body>
      ${html}
    </body>
  </html>
`;

	await page.setContent(fullHtml, {
		waitUntil: 'networkidle0',
	});
	const pdf = await page.pdf({
		format: 'A4',
		printBackground: true,
		displayHeaderFooter: true,
		headerTemplate: '<span></span>', // an empty header
		footerTemplate: `
      <div style="width: 100%; text-align: center; font-size: 10px;">
        <span class="pageNumber"></span>
      </div>
    `, // a footer with page numbers
		margin: {
			top: '60px',
			bottom: '60px',
		},
	});

	await browser.close();

	// Send the PDF file as the response
	res.setHeader('Content-Type', 'application/pdf');
	res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');
	res.send(pdf);
}
