import { commandKey } from '@lexical/utils/meta';
import { hotKeys } from 'data/shortcuts';

export const productGuideContent = [
	{
		title: 'How to use Isaac',
		content: `<p>
      To get started with Isaac, you need to create a project. Creating a
      project in Isaac is easy. Simply click on the small plus icon next
      to the word <strong>"Projects"</strong> on the sidebar.
      This will open a dialog box where you can enter a name for your
      project. Once your project is created, you can begin working on it
      immediately.
    </p>`,
	},
	{
		title: 'How to operate your Reference?',
		content: `<p>
      To view a paper that has been added to your
      <strong>Reference</strong>, simply click on the
      <strong>"Reference"</strong> option in the sidebar.
      All of the papers that were added during your literature search will
      be displayed in this list. Selecting a paper will provide you with
      relevant information that is associated with it. If the paper is
      open source, you can even read it directly in the editor by clicking
      the <strong> "Read PDF" </strong> button.
    </p>`,
	},
	{
		title: 'How to talk to Isaac?',
		content: `<p>
      In addition to its other features, Isaac also includes an AI
      research assistant chatbot called
      <strong>Isaac</strong>. To access the chatbot, simply click the
      <strong>"Talk to Isaac"</strong>
      button on the sidebar. Isaac can help you with a variety of
      research-related tasks such as answering your questions, suggesting
      topics, and providing feedback.
    </p>`,
	},
	{
		title: 'How to search for literature?',
		content: `<p>
      One of the key features of Isaac is its literature search
      functionality. To search for literature, click on the
      <strong>"Reference"</strong> on the
      sidebar and click <strong>Add Reference</strong> A search box will appear where you can enter any keywords
      or phrases to locate an academic paper of your interest. Upon
      clicking the paper, related information about it will be immediately
      available. Furthermore, you can add the paper to your
      <strong>"Reference"</strong> by clicking the
      "Save" button. Keep in mind that it is essential to have a
      document open when you add papers to your reference, as each
      document will have its own list of references.
    </p>`,
	},
	{
		title: 'How to use Notes?',
		content: `<p>
      Notes allow you to save text snippet. To create or view notes, click on the
      <strong>"Notes"</strong> on the
      sidebar. Notes can also be created directly from the editor by selecting the text or from your chat with Isaac.
    </p>`,
	},
	{
		title: 'How to use the AI Assistant?',
		content: `<div>
      The AI Assistant menu contains several features that are designed to
      make the academic writing process more efficient and effective.
      These features include:
      <ul>
        <li>
          <strong>Manipulate Text:</strong> The ability to manipulate text
          using AI features such as paraphrasing, expanding, improving,
          and shortening.
        </li>
        <li>
          <strong>Summarize:</strong> The ability to summarize long text
          into shorter, more manageable chunks.
        </li>
        <li>
          <strong>Get Feedback:</strong> The ability to receive feedback
          on selected text.
        </li>
        <li>
          <strong>Turn Bullet Points into Paragraphs:</strong> The ability
          to convert bullet points into full paragraphs.
        </li>
        <li>
          <strong>Find Sources:</strong> The ability to find relevant
          literature for writing.
        </li>
      </ul>
    </div>`,
	},
	{
		title: 'How to use the "Manipulate Text" feature?',
		content: `<p>
    When you click on "Manipulate Text" a menu titled
    "Quick Commands" will appear. In this menu, you can click
    on one of the following AI features:
    <ul>
      <li>
        <strong>Paraphrase</strong> - to reword the highlighted text
      </li>
      <li>
        <strong>Expand</strong> - to add more information to the
        highlighted text
      </li>
      <li>
        <strong>Improve</strong> - to enhance the readability of the
        highlighted text
      </li>
      <li>
        <strong>Shorten</strong> - to shorten the highlighted text
      </li>
    </ul>
    Once you click on one of these features, a modal will pop up with
    the AI output suggestion. You can either accept or decline the
    output. If you accept, it will replace the highlighted text in the
    document.
    <br />
    Note that you will not be able to access the "Manipulate
    Text" feature if the highlighted text is above 1000 characters.
    </p>`,
	},
	{
		title: 'How to use the “Get Feedback” feature?',
		content: `<p>
    The <strong>“Get Feedback”</strong> feature is designed to provide
    users with feedback on the text they have selected.
    <br />
    If you click on the <strong>"Get Feedback"</strong>
    button, the text you have selected will be highlighted in yellow and
    a loading icon will appear next to the button.
    <br />
    Once the loading is completed, a comment section from the right-hand
    side of the editor will pop up. This section will contain the
    feedback generated by Isaac on the text you have chosen to receive
    feedback for.
    </p>`,
	},
	{
		title: 'How to use the “Find Sources” feature?',
		content: `<p>
      The <strong>“Find Sources”</strong> feature is designed to help
      users find relevant literature for their writing.
      <br />
      To use the “Find Sources” feature, follow these steps:
      <li>Highlight the text you want to find sources for.</li>
      <li>
        Click on the "Find Sources" option in the AI Assistant
        menu.
      </li>
      <li>
        A modal titled <strong>“Sources Found by Isaac” </strong> will
        appear, displaying sources relevant to the highlighted text.
      </li>
      <li>
        To access a source, click on its name to open it in a new tab.
      </li>
      <li>
        Alternatively, click on the "cite" button next to a
        source to copy it to the clipboard and add it to the reference
        list.
      </li>
    </p>`,
	},
	{
		title: 'Learn Keyboard Shortcuts',
		content: `<div>
    <p><strong>Global</strong></p>
    <br/>
    <p><strong>${commandKey} + ${hotKeys.toggleSidebar.key}</strong> - Toggle Sidebar</p>
    <p><strong>${commandKey} + ${hotKeys.isaacPanel.key}</strong> - Open Isaac Panel</p>
    <p><strong>${commandKey} + ${hotKeys.referencePanel.key}</strong> - Open Reference Panel</p>
    <p><strong>${commandKey} + ${hotKeys.notePanel.key}</strong> - Open Notes Panel</p>
    <p><strong>${commandKey} + ${hotKeys.closePanel.key}</strong> - Closes Right Panel</p>
    <p><strong>${commandKey} + ${hotKeys.toggleTheme.key}</strong> - Toggle Light/Dark Theme</p>
    <p><strong>${commandKey} + (1 to 7)</strong> - Toggle Active Tab</p>
    <br/>
    <p><strong>On Editor</strong></p>
    <br/>
    <p><strong>/</strong> - Open Isaac Command</p>
  </div>`,
	},
];
