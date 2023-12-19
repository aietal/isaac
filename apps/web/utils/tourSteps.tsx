import { Button } from '@components/ui/button';
import { StepType } from '@reactour/tour';

export const steps: StepType[] = [
	{
		content: ({ setCurrentStep }) => (
			<div>
				<p className="pb-2 font-semibold">Welcome to Isaac Editor!</p>
				<p>
					I&apos;m <span>Isaac AI</span>, your friendly assistant for academic
					work.
				</p>
				<p>Let&apos;s explore your new workspace!</p>
				<div className="flex justify-end pt-2">
					<Button
						size="sm"
						color="indigo.6"
						onClick={() => setCurrentStep(prev => prev + 1)}
					>
						{"Let's start"}
					</Button>
				</div>
			</div>
		),
		position: 'center',
		selector: 'body',
	},
	{
		selector: '#create-project-button',
		content: (
			<div>
				<p className="pb-2 font-semibold">Create a Project</p>
				<p>
					{"Let's begin by clicking on the"}
					<span>{' + '}</span>
					icon to create your first project.
				</p>
			</div>
		),
		position: 'right',
		highlightedSelectors: ['#create-project-input'],
		mutationObservables: ['#create-project-input'],
		resizeObservables: ['#create-project-input'],
	},
	{
		selector: '#create-project-input',
		content: (
			<div>
				<p className="pb-2 font-semibold">Name Your Project</p>
				<p>
					Assign a name to your project and press
					<span>{' Enter '}</span>
				</p>
			</div>
		),
		position: 'top',
		highlightedSelectors: ['#create-project-input'],
		mutationObservables: ['#create-project-input'],
		resizeObservables: ['#create-project-input'],
	},
	{
		selector: '#all-projects',
		content: ({ setCurrentStep }) => (
			<div>
				<p className="pb-2 font-semibold">Explore Your Project</p>
				<p>
					Congratulations! Your project is now created along with your Main
					Document
				</p>
				<p>You could always right-click to rename or delete it.</p>
				<div className="justify-right pt-5">
					<Button onClick={() => setCurrentStep(prev => prev + 1)}>
						{'Next'}
					</Button>
				</div>
			</div>
		),
		position: 'right',
	},
	{
		selector: '#create-document-button',
		content: (
			<div>
				<p className="pb-2 font-semibold">Create a Document</p>
				<p>
					To create your first document, hover over your Project name and click
					the
					<span>{' + '}</span>
					icon.
				</p>
			</div>
		),
		position: 'right',
	},
	{
		selector: '#create-document-input',
		content: (
			<div>
				<p className="pb-2 font-semibold">Name Your Document</p>
				<p>
					Enter a name for your document and press
					<span>{' Enter '}</span>.
				</p>
			</div>
		),
		position: 'top',
		highlightedSelectors: ['#create-project-input'],
		mutationObservables: ['#create-project-input'],
		resizeObservables: ['#create-project-input'],
	},
	{
		selector: '#created-documents',
		content: ({ setCurrentStep }) => (
			<div>
				<p className="pb-2 font-semibold">Document Created</p>
				<p>
					Congratulations! Your document has been created and is now open in the
					Editor Tab.
				</p>
				<div className="justify-right pt-5">
					<Button
						color="indigo.6"
						onClick={() => setCurrentStep(prev => prev + 1)}
					>
						{'Next'}
					</Button>
				</div>
			</div>
		),
		position: 'top',
		highlightedSelectors: ['#create-project-input'],
		mutationObservables: ['#create-project-input'],
		resizeObservables: ['#create-project-input'],
	},
	{
		selector: '#ask-isaac',
		position: 'right',
		content: (
			<div>
				<p className="pb-2 font-semibold">Isaac</p>
				<p>Isaac is always available to assist you.</p>
				<p>
					Click on
					<span>{' Isaac '}</span>
					whenever you need help.
				</p>
			</div>
		),
	},
	{
		selector: '#right-panel',
		position: 'right',
		content: ({ setCurrentStep }) => (
			<div>
				<p className="pb-2 font-semibold">Isaac</p>
				<p>
					{`It works similar as most AI Chatbot, but with Isaac, you are able to
          chat with your Project, get Real Time Data and chat with files you've
          uploaded`}
				</p>
				<div className="justify-right pt-5">
					<Button
						color="indigo.6"
						onClick={() => setCurrentStep(prev => prev + 1)}
					>
						{'Next'}
					</Button>
				</div>
			</div>
		),
	},
	{
		selector: '#isaac-chat-input',
		position: 'top',
		content: ({ setCurrentStep }) => (
			<div>
				<p className="pb-2 font-semibold">Isaac</p>
				<p>Type in your prompt and get answer from Isaac</p>
				<div className="justify-right pt-5">
					<Button
						color="indigo.6"
						onClick={() => setCurrentStep(prev => prev + 1)}
					>
						{'Next'}
					</Button>
				</div>
			</div>
		),
	},
	{
		selector: '#reference',
		position: 'right',
		content: (
			<div>
				<p className="pb-2 font-semibold">References & Literature Search</p>
				<p>
					{`Let's proceed to the`}
					<span>{' Reference & Literature Search '}</span>.
				</p>
			</div>
		),
		highlightedSelectors: ['#right-drawer'],
		mutationObservables: ['#right-drawer'],
		resizeObservables: ['#right-drawer'],
	},
	{
		selector: '#right-panel',
		position: 'left',
		content: ({ setCurrentStep }) => (
			<div>
				<p className="pb-2 font-semibold">Reference Section</p>
				<p>
					This section lets you search, upload, save, and read literature and
					abstracts of published papers.
				</p>
				<div className="justify-right pt-5">
					<Button
						color="indigo.6"
						onClick={() => setCurrentStep(prev => prev + 1)}
					>
						{'Next'}
					</Button>
				</div>
			</div>
		),
	},
	{
		selector: '#add-reference',
		position: 'left',
		content: ({ setCurrentStep }) => (
			<div>
				<p className="pb-2 font-semibold">Reference Section</p>

				<p>
					{`For this new project, it is obviously empty. Click on the `}
					<span>{'+ Add reference '}</span>
				</p>
			</div>
		),
	},
	{
		selector: '#right-panel',
		position: 'left',
		content: ({ setCurrentStep }) => (
			<div>
				<p className="pb-2 font-semibold">Literature Search & Uploads</p>
				<p>
					This sub-section allows you to search existing literature or upload
					your own documents
				</p>{' '}
				<div className="justify-right pt-5">
					<Button
						color="indigo.6"
						onClick={() => setCurrentStep(prev => prev + 1)}
					>
						{'Next'}
					</Button>
				</div>
			</div>
		),
	},
	{
		selector: '#literature-search-input',
		position: 'left',
		content: ({ setCurrentStep }) => (
			<div>
				<p className="pb-2 font-semibold">Try Search</p>
				<p>
					Try searching for &quot;apple&quot; (or any topic) and press
					<span>{' Enter '}</span>.
				</p>
			</div>
		),
	},
	{
		selector: '#literature-search-results',
		position: 'left',
		content: (
			<div>
				<p className="pb-2 font-semibold">Literature Search Results</p>
				<p>
					You can click on each result to view more details, or click
					<span>{' + '}</span>
					to add it to your references.
				</p>
				<p>Saved literature is stored in your Reference List.</p>
			</div>
		),
	},
	{
		selector: '#reference-list',
		position: 'left',
		content: ({ setCurrentStep }) => (
			<div>
				<p className="pb-2 font-semibold">Reference List</p>
				<p>
					Saved reference will be stored here, same goes with uploaded
					documents.
					<span>{' Reference List '}</span>.
				</p>
				<div className="justify-right pt-5">
					<Button
						color="indigo.6"
						onClick={() => setCurrentStep(prev => prev + 1)}
					>
						{'Next'}
					</Button>
				</div>
			</div>
		),
		highlightedSelectors: ['#right-drawer'],
		mutationObservables: ['#right-drawer'],
		resizeObservables: ['#right-drawer'],
	},
	{
		selector: '#notes',
		position: 'right',
		content: ({ setCurrentStep }) => (
			<div>
				<p className="pb-2 font-semibold">Notes</p>
				<p>You can save snippets of information with notes</p>
			</div>
		),
	},
	{
		selector: '#right-panel',
		position: 'right',
		content: ({ setCurrentStep }) => (
			<div>
				<p className="pb-2 font-semibold">Notes</p>
				<p>
					You can create notes directly from this panel, text documents or the
					Isaac responses. Give it a try!
				</p>
				<div className="justify-right pt-5">
					<Button
						color="indigo.6"
						onClick={() => setCurrentStep(prev => prev + 1)}
					>
						{'Next'}
					</Button>
				</div>
			</div>
		),
	},
	{
		selector: '#editor-content',
		content: (
			<div>
				<p className="pb-2 font-semibold">Text Editor</p>
				<p>
					Select any text or paragraph in the editor by dragging your cursor.
				</p>
				<p>A Text format popup will appear upon selection.</p>
				<p>
					Click on
					<span>{' AI Function '}</span>
					to explore its features.
				</p>
			</div>
		),
		position: 'center',
	},
	{
		selector: '#ai-assistant-menu-dropdown',
		content: ({ setCurrentStep }) => (
			<div>
				<p className="pb-2 font-semibold">Editor</p>
				<p>You can use my AI functions on the selected text</p>
				<div className="justify-right pt-5">
					<Button
						color="indigo.6"
						onClick={() => setCurrentStep(prev => prev + 1)}
					>
						{'Next'}
					</Button>
				</div>
			</div>
		),
	},
	{
		disableActions: true,
		selector: '#ai-assistant-menu-dropdown',
		content: ({ setCurrentStep }) => (
			<div>
				<p className="pb-2 font-semibold">Editor</p>
				<p>
					I am Able to paraphrase, expand, shorten or improve the text you have
					written
				</p>
				<div className="justify-right pt-5">
					<Button
						color="indigo.6"
						onClick={() => setCurrentStep(prev => prev + 1)}
					>
						{'Next'}
					</Button>
				</div>
			</div>
		),
	},
	{
		disableActions: true,
		selector: '#other-items',
		content: ({ setCurrentStep }) => (
			<div>
				<p className="pb-2 font-semibold">Editor</p>
				<p>
					I can also summarize the marked text or turn your bullet points into
					text
				</p>
				<p>
					if you need academic feedback on your work, I can provide it for you
				</p>
				<div className="justify-right pt-5">
					<Button
						color="indigo.6"
						onClick={() => setCurrentStep(prev => prev + 1)}
					>
						{'Next'}
					</Button>
				</div>
			</div>
		),
	},

	{
		// 19
		selector: '#editor-content',
		content: ({ setCurrentStep }) => (
			<div>
				<p className="pb-2 font-semibold">Editor</p>
				<p>
					{`Go to the last paragraph and type `}
					<span>{' "/" '}</span>
				</p>
			</div>
		),
		position: 'center',
	},
	{
		// 20
		selector: '#command-popup',
		content: ({ setCurrentStep }) => (
			<div>
				<p className="pb-2 font-semibold">Editor</p>
				<p>
					{`While working on your text I can complete your sentence or generate an outline for
          you with this shortcut`}
				</p>
				<div className="justify-right pt-5">
					<Button
						color="indigo.6"
						onClick={() => setCurrentStep(prev => prev + 1)}
					>
						{'Next'}
					</Button>
				</div>
			</div>
		),
		position: 'top',
	},
	{
		// 21
		selector: '#how-to-use-isaac',
		content: ({ setIsOpen }) => (
			<div>
				<p className="pb-2 font-semibold">Guide</p>
				<p>
					More detailed information about using your new workspace can be found
					here
				</p>
				<p>
					Thanks for your attention and see you later when working together on
					your project :)
				</p>
				<div className="justify-right pt-5">
					<Button color="indigo.6" onClick={() => setIsOpen(false)}>
						{'Bye Bye'}
					</Button>
				</div>
			</div>
		),
		highlightedSelectors: ['#right-drawer'],
		mutationObservables: ['#right-drawer'],
		resizeObservables: ['#right-drawer'],
	},
];
