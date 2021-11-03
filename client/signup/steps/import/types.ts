export type GoToStep = ( stepName: string, stepSectionName?: string ) => void;

export type FeatureName =
	| 'tags'
	| 'posts'
	| 'pages'
	| 'pages_static'
	| 'blocks'
	| 'images'
	| 'photos'
	| 'videos'
	| 'files'
	| 'styles'
	| 'themes'
	| 'themes_custom'
	| 'colors'
	| 'fonts'
	| 'plugins';

export type FeatureList = { [ key in FeatureName ]: string };
