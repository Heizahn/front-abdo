export const formatDate = (dateString: string) => {
	if (!dateString) return '';
	const date = new Date(dateString);
	return date.toLocaleString('es-VE', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
};
