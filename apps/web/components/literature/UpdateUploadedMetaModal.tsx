import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@components/ui/dialog';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { useLiteratureReferenceStore } from '@context/literatureReference.store';
import useUpdateCustomCitation from '@hooks/api/useUpdateCustomCitation';
import { supabase } from '@utils/supabase';
import { currentYear, earliestLiteratureYear } from 'data/meta';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type UploadedFileCitationFormSchema = {
	title: string;
	year: number;
	authors: string;
};

// TODO: Need AI Feature to auto fill the form
const UpdateUploadedMeta = () => {
	const open = useLiteratureReferenceStore(s => s.showUploadMetaModal);
	const userUpload = useLiteratureReferenceStore(s => s.userUploads);
	const setOpen = useLiteratureReferenceStore(s => s.setShowUploadMetaModal);
	const { mutateAsync: addCitation } = useUpdateCustomCitation();

	const onSubmit = (input: UploadedFileCitationFormSchema) => {
		//
		if (open.uploadId) {
			const authorArr = input.authors
				.split(',')
				.map(author => author.trim())
				.filter(author => !!author);

			addCitation({
				docId: open.uploadId,
				citation: {
					title: input.title,
					authors: authorArr,
					year: Number(input.year),
				},
			});
			setOpen(undefined);
		}
	};

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<UploadedFileCitationFormSchema>({
		defaultValues: {
			title: undefined,
			year: undefined,
			authors: undefined,
		},
	});

	// initialize form
	useEffect(() => {
		if (!open?.uploadId) {
			// do nothing
		} else if (userUpload?.length && open?.uploadId) {
			const dataToInit = userUpload.find(i => i.id === open.uploadId);
			setValue(
				'title',
				dataToInit.custom_citation?.title ||
					dataToInit.file_name.replace('.pdf', ''),
			);
			setValue('authors', dataToInit.custom_citation?.authors.join(', '));
			setValue('year', dataToInit.custom_citation?.year);
		} else {
			const fetchData = async () => {
				try {
					// get title, authors, year from supabse uploads table at custom_citation
					const { data: citation, error } = await supabase
						.from('uploads')
						.select('custom_citation')
						.eq('id', open?.uploadId)
						.single();
					if (error) {
						// do nothing
					} else {
						setValue(
							'title',
							citation?.custom_citation?.title ||
								open?.fileName.replace('.pdf', ''),
						);
						setValue('authors', citation?.custom_citation?.authors.join(', '));
						setValue('year', citation?.custom_citation?.year);
					}
				} catch (error) {
					console.error(error);
				}
			};

			fetchData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userUpload, open?.uploadId]);
	return (
		<Dialog
			open={!!open}
			onOpenChange={open =>
				setOpen(open ? { uploadId: '', fileName: '' } : undefined)
			}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Document Details</DialogTitle>
				</DialogHeader>
				<DialogDescription> {open?.fileName}</DialogDescription>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-2.5"
				>
					<div>
						<p className="font-semibold text-sm mb-0.5">Title</p>
						<Input
							placeholder={open?.fileName}
							{...register('title', {
								required: true,
							})}
						/>
						{errors.title && (
							<p className="text-xs text-red-800">* Cannot be empty</p>
						)}
					</div>
					<div>
						<p className="font-semibold text-sm mb-0.5">Year</p>
						<Input
							type="number"
							placeholder="2002"
							{...register('year', {
								required: true,
								max: currentYear,
								min: earliestLiteratureYear,
							})}
						/>
						{errors.year && (
							<p className="text-xs text-red-800">
								* Must be between {earliestLiteratureYear} to {currentYear}
							</p>
						)}
					</div>
					<div>
						<p className="font-semibold text-sm mb-0.5">
							Authors (Separated by comma)
						</p>
						<Textarea
							placeholder="Albert Einstein, William Shakespeare, Sigmund Freud"
							{...register('authors', { required: true })}
						/>
						{errors.authors && (
							<p className="text-xs text-red-800">* Cannot be empty</p>
						)}
					</div>
					<Button type="submit">Update</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateUploadedMeta;
