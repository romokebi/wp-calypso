import { ROUTE_SET } from 'calypso/state/action-types';

const EMPTY_QUERY = {};

const initialState = {
	initial: EMPTY_QUERY,
	current: EMPTY_QUERY,
	previous: EMPTY_QUERY,
};

export const queryReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case ROUTE_SET:
			return {
				initial: state.initial === EMPTY_QUERY ? action.query : state.initial,
				current: action.query,
				previous: state.current,
			};
	}

	return state;
};

export default queryReducer;
