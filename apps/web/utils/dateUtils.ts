import {
	differenceInHours,
	differenceInMinutes,
	format,
	formatDistanceToNow,
	intlFormatDistance,
	isValid,
	subDays,
} from 'date-fns';

export function getRelativeDate(date: Date): string {
	const currentDate = new Date();
	const formattedDate = formatDistanceToNow(date, { addSuffix: true });

	if (
		Math.abs(currentDate.getTime() - date.getTime()) >
		5 * 24 * 60 * 60 * 1000
	) {
		// If the date is more than 5 days ago, format it as "day month"
		return format(date, 'd MMMM');
	}

	return formattedDate;
}

export function getRelativeDateTime(inputDate: Date): string {
	const currentDate = new Date();
	const minutesDiff = differenceInMinutes(currentDate, inputDate);

	if (minutesDiff < 60) {
		return `${minutesDiff} minutes ago`;
	}

	const hoursDiff = differenceInHours(currentDate, inputDate);
	if (hoursDiff < 24) {
		return `${hoursDiff} hours ago`;
	}

	const yesterday = subDays(inputDate, 1);
	if (isValid(yesterday)) {
		return format(yesterday, 'dd MMM');
	}

	return 'Invalid Date';
}
