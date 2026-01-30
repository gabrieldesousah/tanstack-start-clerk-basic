export function dateDiffInHours(a: Date, b: Date) {
	return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60));
}
