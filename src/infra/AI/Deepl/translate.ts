import translate from 'translate';
import alternativeTranslate from 'translatte';

translate.engine = 'deepl';
translate.key = 'fd642945-f31d-4c15-b8e8-97e0bbfdc4e1:fx';

export const translateText = async (text: string, from: string, to: string) => {
	const deeplTranslate = await translate(text, { from, to });

	const freeTranslatte = await alternativeTranslate(text, { from, to });

	if (freeTranslatte.text !== deeplTranslate) {
		return {
			translation: deeplTranslate,
			synonyms: [freeTranslatte.text],
		};
	}

	return {
		translation: deeplTranslate,
	};
};
