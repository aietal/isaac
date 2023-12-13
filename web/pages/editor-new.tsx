import CreateNewProjectModal from '@components/core/CreateNewProjectModal';
import ProductGuideModal from '@components/core/ProductGuideModal';
import { useUIStore } from '@context/ui.store';
import { useUser } from '@context/user';
import useHandleToastQuery from '@hooks/misc/useHandleToastQuery';
import Head from 'next/head';

const EditorHead = () => (
	<Head>
		<title>Isaac Editor - AI-first Text Editor For Academic Writing</title>
		<meta
			property="og:title"
			content="Isaac Editor - AI-first Text Editor For Academic Writing"
			key="title"
		/>
		<meta name="description" content="Isaac AI Editor Description" />
	</Head>
);

export default function NewEditor() {
	const { user } = useUser();
	const setProductGuideModalOpen = useUIStore(s => s.setProductGuideModalOpen);
	useHandleToastQuery();
	return (
		<>
			<CreateNewProjectModal />
			<ProductGuideModal />
			<EditorHead />
			<main className="h-screen bg-white">
				<div className="border-b-border inline-flex max-h-10 w-screen items-center justify-between border-b px-1 h-[44px]">
					<div className="z-20 inline-flex items-center">
						<button
							className="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground relative inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							data-state="closed"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="lucide lucide-panel-left-close"
							>
								<rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
								<path d="M9 3v18"></path>
								<path d="m16 15-3-3 3-3"></path>
							</svg>
						</button>
						<div>
							<button
								className="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground text-accent-foreground relative inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
								data-state="closed"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-download"
								>
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
									<polyline points="7 10 12 15 17 10"></polyline>
									<line x1="12" x2="12" y1="15" y2="3"></line>
								</svg>
							</button>
						</div>
					</div>
					<div className="z-20 hidden items-center md:inline-flex">
						<div
							role="menubar"
							className="flex h-9 flex-col items-center gap-1 space-x-1 outline-none rounded-md p-1 md:flex-row"
							tabIndex={0}
							data-orientation="horizontal"
						>
							<div className="w-full">
								<div className="relative z-10 flex items-center gap-0.5 overflow-hidden rounded-lg border p-0.5">
									<button className="text-primary-foreground transition-color ease-out-expo flex w-full items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium leading-none duration-200">
										GPT-3.5
									</button>
									<button className="text-primary hover:bg-secondary transition-color ease-out-expo flex w-full items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium leading-none opacity-70 duration-200">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="lucide lucide-sparkles"
										>
											<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
											<path d="M5 3v4"></path>
											<path d="M19 17v4"></path>
											<path d="M3 5h4"></path>
											<path d="M17 19h4"></path>
										</svg>
										GPT-4
									</button>
									<div className="bg-primary ease-out-expo absolute -z-10 rounded-md transition-all duration-500 h-[0px] w-[0px]"></div>
								</div>
							</div>
							<button
								type="button"
								role="menuitem"
								id="radix-:r6l:"
								aria-haspopup="menu"
								aria-expanded="false"
								data-state="closed"
								className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground text-accent-foreground !ml-0 flex w-full cursor-default select-none items-center rounded-sm px-2 py-1 text-xs font-medium outline-none md:w-auto"
								tabIndex={-1}
								data-orientation="horizontal"
								data-radix-collection-item=""
							>
								<span className="mx-auto">Settings</span>
							</button>
							<button
								type="button"
								role="menuitem"
								id="radix-:r6p:"
								aria-haspopup="menu"
								aria-expanded="false"
								data-state="closed"
								className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground text-accent-foreground !ml-0 flex w-full cursor-default select-none items-center rounded-sm px-2 py-1 text-xs font-medium outline-none md:w-auto"
								tabIndex={-1}
								data-orientation="horizontal"
								data-radix-collection-item=""
							>
								<span className="mx-auto">Help</span>
							</button>
						</div>
					</div>
					<div className="z-20 md:hidden">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="cursor-pointer"
							type="button"
							aria-haspopup="dialog"
							aria-expanded="false"
							aria-controls="radix-:r6s:"
							data-state="closed"
						>
							<circle cx="6" cy="13" r="3"></circle>
							<path d="m9.7 14.4-.9-.3"></path>
							<path d="m3.2 11.9-.9-.3"></path>
							<path d="m4.6 16.7.3-.9"></path>
							<path d="m7.6 16.7-.4-1"></path>
							<path d="m4.8 10.3-.4-1"></path>
							<path d="m2.3 14.6 1-.4"></path>
							<path d="m8.7 11.8 1-.4"></path>
							<path d="m7.4 9.3-.3.9"></path>
							<path d="M14 2v6h6"></path>
							<path d="M4 5.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-1.5"></path>
						</svg>
					</div>
					<div className="absolute z-10 flex w-screen justify-center">
						<button
							className="sm-[300px] h-7 w-[280px] rounded border text-sm md:w-[360px]"
							type="button"
							aria-haspopup="dialog"
							aria-expanded="false"
							aria-controls="radix-:r6t:"
							data-state="closed"
						>
							<span className="">⌘ + K</span>
						</button>
					</div>
				</div>
				<div className="flex">
					<div className="flex-grow">
						<div className="flex h-full w-full flex-col-reverse flex-nowrap md:flex-row lg:flex">
							<div className="flex flex-row justify-center gap-2 border-t bg-white p-3 py-3 sm:gap-4 md:flex-col md:justify-start md:gap-2 md:border-r md:border-t-0">
								<button
									data-state="closed"
									className="hover:text-isaac hover:dark:text-isaac bg-accent text-isaac dark:text-isaac flex h-10 w-10 items-center justify-center rounded-md transition-colors"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="22"
										height="22"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.4"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="lucide lucide-files"
									>
										<path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"></path>
										<path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8"></path>
										<path d="M15 2v5h5"></path>
									</svg>
								</button>
								<button
									data-state="closed"
									className="hover:text-isaac hover:dark:text-isaac flex h-10 w-10 items-center justify-center rounded-md text-gray-400 transition-colors dark:text-gray-500"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="22"
										height="22"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.4"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="lucide lucide-message-square"
									>
										<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
									</svg>
								</button>
								<button
									data-state="closed"
									className="hover:text-isaac hover:dark:text-isaac flex h-10 w-10 items-center justify-center rounded-md text-gray-400 transition-colors dark:text-gray-500"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="22"
										height="22"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.4"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="lucide lucide-search"
									>
										<circle cx="11" cy="11" r="8"></circle>
										<path d="m21 21-4.3-4.3"></path>
									</svg>
								</button>
								<button
									data-state="closed"
									className="hover:text-isaac hover:dark:text-isaac flex h-10 w-10 items-center justify-center rounded-md text-gray-400 transition-colors dark:text-gray-500"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="22"
										height="22"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.4"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="lucide lucide-bookmark"
									>
										<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
									</svg>
								</button>
								<button
									data-state="closed"
									className="hover:text-isaac hover:dark:text-isaac flex h-10 w-10 items-center justify-center rounded-md text-gray-400 transition-colors dark:text-gray-500"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="22"
										height="22"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.4"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="lucide lucide-sticky-note"
									>
										<path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"></path>
										<path d="M15 3v6h6"></path>
									</svg>
								</button>
								<div className="div xs:flex-row mt-auto flex gap-2 sm:gap-4 md:flex-col md:gap-2">
									<div className="w-text-popover-foreground hover:text-muted-foreground relative flex w-full cursor-pointer items-center justify-start gap-2">
										<span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-md">
											<img
												className="aspect-square h-full w-full"
												alt="user-pp"
												src="https://lh3.googleusercontent.com/a/ACg8ocJ4yjSGVhWDjRAzx2YZ_RCQ-lADhqG7OmRwi2Hu2I2gZFM=s96-c"
											/>
										</span>
									</div>
								</div>
							</div>
							<div className="split-view split-view-horizontal allotment-module_splitView__L-yRc allotment-module_horizontal__7doS8 allotment">
								<div className="sash-container allotment-module_sashContainer__fzwJF">
									<div
										className="sash sash-module_sash__K-9lB sash-mac sash-module_mac__Jf6OJ sash-vertical sash-module_vertical__pB-rs sash-module_minimum__-UKxp sash-minimum"
										data-testid="sash"
										style={{ left: '246px' }}
									></div>
								</div>
								<div className="split-view-container allotment-module_splitViewContainer__rQnVa">
									<div
										className="split-view-view allotment-module_splitViewView__MGZ6O split-view-view-visible flex h-full w-full flex-col bg-white"
										data-testid="split-view-view"
									>
										<div className="flex">
											<div className="scrollbar-hide inline-flex items-center overflow-x-auto">
												<div
													role="button"
													tabIndex={0}
													aria-disabled="false"
													aria-roledescription="sortable"
													aria-describedby="DndDescribedBy-3"
												>
													<div className="hover:bg-accent transition-width border-t-isaac flex h-8 w-[150px] cursor-pointer select-none items-center gap-2 border-b border-r border-t border-b-transparent bg-transparent px-2">
														<div>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="18"
																height="18"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="1.4"
																strokeLinecap="round"
																strokeLinejoin="round"
																className="lucide lucide-file-text"
															>
																<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
																<polyline points="14 2 14 8 20 8"></polyline>
																<line x1="16" x2="8" y1="13" y2="13"></line>
																<line x1="16" x2="8" y1="17" y2="17"></line>
																<line x1="10" x2="8" y1="9" y2="9"></line>
															</svg>
														</div>
														<p
															className="w-[80px] min-w-0 flex-grow truncate text-sm"
															data-state="closed"
														>
															Welcome
														</p>
														<div className="flex">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="14"
																height="14"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="1.2"
																strokeLinecap="round"
																strokeLinejoin="round"
																className="text-gray-500 hover:text-gray-800"
															>
																<path d="M18 6 6 18"></path>
																<path d="m6 6 12 12"></path>
															</svg>
														</div>
													</div>
													<div className="p-12 flex flex-col max-w-full w-screen">
														<h1 className="text-3xl font-semibold">Isaac</h1>
														<p className="mt-2 text-xl text-gray-400">
															Academic Writing. As it should be.
														</p>
														<div className="flex flex-row flex-wrap w-full">
															<div className="mt-12 w-full md:w-1/2 flex flex-col">
																<span className="text-lg font-semibold">
																	Get Started 🚀
																</span>
																<button
																	onClick={() => {
																		setCreateNewProjectModalOpen(true);
																	}}
																	className="mt-3 flex flex-row items-center gap-x-2"
																>
																	<svg
																		width="20px"
																		height="20px"
																		viewBox="0 0 24 24"
																		fill="none"
																		xmlns="http://www.w3.org/2000/svg"
																	>
																		<path
																			d="M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H10M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19M19 9V10M9 17H11.5M9 13H14M9 9H10M14 21L16.025 20.595C16.2015 20.5597 16.2898 20.542 16.3721 20.5097C16.4452 20.4811 16.5147 20.4439 16.579 20.399C16.6516 20.3484 16.7152 20.2848 16.8426 20.1574L21 16C21.5523 15.4477 21.5523 14.5523 21 14C20.4477 13.4477 19.5523 13.4477 19 14L14.8426 18.1574C14.7152 18.2848 14.6516 18.3484 14.601 18.421C14.5561 18.4853 14.5189 18.5548 14.4903 18.6279C14.458 18.7102 14.4403 18.7985 14.405 18.975L14 21Z"
																			stroke="#f95730"
																			strokeWidth="2"
																			strokeLinecap="round"
																			strokeLinejoin="round"
																		/>
																	</svg>
																	<span className="text-[#f95730] text-md">
																		New Document
																	</span>
																</button>
																<button
																	onClick={() => setProductGuideModalOpen(true)}
																	className="mt-3 flex flex-row items-center gap-x-2"
																>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		width="20px"
																		height="20px"
																		viewBox="0 0 16 16"
																		fill="none"
																	>
																		<path
																			fill="#f95730"
																			fillRule="evenodd"
																			d="M1.25 2C.56 2 0 2.56 0 3.25v8.5C0 12.44.56 13 1.25 13H5c.896 0 1.475.205 1.809.448.317.23.441.51.441.802a.75.75 0 001.5 0c0-.292.124-.572.441-.802.334-.243.913-.448 1.809-.448h3.75c.69 0 1.25-.56 1.25-1.25v-8.5C16 2.56 15.44 2 14.75 2H11c-1.154 0-2.106.354-2.772 1-.081.08-.157.161-.228.246A3.131 3.131 0 007.772 3C7.106 2.354 6.154 2 5 2H1.25zm7.5 9.967c.61-.309 1.372-.467 2.25-.467h3.5v-8H11c-.846 0-1.394.253-1.728.577-.335.325-.522.787-.522 1.34v6.55zm-1.5 0v-6.55c0-.553-.187-1.015-.522-1.34C6.394 3.753 5.846 3.5 5 3.5H1.5v8H5c.878 0 1.64.158 2.25.467z"
																			clipRule="evenodd"
																		/>
																	</svg>
																	<span className="text-[#f95730] text-md">
																		Product Guide
																	</span>
																</button>
															</div>
															<div className="mt-12 w-full md:w-1/2 flex flex-col">
																<span className="text-lg font-semibold">
																	Get Involved ✨
																</span>
																<a
																	target="_blank"
																	href="https://discord.com/invite/JqjMv4yrAn"
																	className="mt-3 flex flex-row items-center gap-x-2"
																>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		width="20px"
																		viewBox="0 0 127.14 96.36"
																	>
																		<defs></defs>
																		<g id="图层_2" data-name="图层 2">
																			<g
																				id="Discord_Logos"
																				data-name="Discord Logos"
																			>
																				<g
																					id="Discord_Logo_-_Large_-_White"
																					data-name="Discord Logo - Large - White"
																				>
																					<path
																						className="fill-[#5865f2]"
																						d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
																					/>
																				</g>
																			</g>
																		</g>
																	</svg>
																	<span className="text-[#5865f2] text-md">
																		Join Our Community
																	</span>
																</a>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
