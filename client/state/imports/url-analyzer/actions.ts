import 'calypso/state/imports/init';
import wpcom from 'calypso/lib/wp';
import {
	URL_ANALYZER_ANALYZE_DONE,
	URL_ANALYZER_ANALYZE,
	URL_ANALYZER_ANALYZE_SUCCESS,
	URL_ANALYZER_ANALYZE_ERROR,
} from '../../action-types';
import type { urlData } from 'calypso/signup/steps/import/types';
import type { AnyAction, Dispatch } from 'redux';

export const analyzeUrl = ( url: string ) => (
	dispatch: Dispatch< AnyAction >
): Promise< void > => {
	dispatch( {
		type: URL_ANALYZER_ANALYZE,
	} );

	return wpcom
		.undocumented()
		.analyzeUrl( url )
		.then( ( response: urlData ) => {
			// Update the state
			dispatch( {
				type: URL_ANALYZER_ANALYZE_SUCCESS,
				payload: response,
			} );
		} )
		.catch( ( error: Error ) => {
			dispatch( {
				type: URL_ANALYZER_ANALYZE_ERROR,
				payload: error,
			} );

			throw error;
		} )
		.finally( () => {
			dispatch( {
				type: URL_ANALYZER_ANALYZE_DONE,
			} );
		} );
};
