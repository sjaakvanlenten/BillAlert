import { FILTER_GREEN, FILTER_ORANGE, FILTER_RED } from '../actions/filters';

const initialState = {
    filters: [true,true,true],
};

const filterReducer = (state = initialState, action) => {
    switch (action.type) {
        case FILTER_GREEN:
            let filtersGreen = initialState.filters;
            filtersGreen[0] = !filtersGreen[0]
            return {
                filters: filtersGreen
            }
        case FILTER_ORANGE:
            let filterOrange = initialState.filters;
            filterOrange[1] = !filterOrange[1]
            return {
                filters: filterOrange
            }
        case FILTER_RED:
            let filterRed = initialState.filters;
            filterRed[2] = !filterRed[2]
            return {
                filters: filterRed
            }
        default:
            return state;
    }

}

export default filterReducer;