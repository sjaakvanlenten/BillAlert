export const FILTER_GREEN = 'FILTER_GREEN';
export const FILTER_ORANGE = 'FILTER_ORANGE';
export const FILTER_RED = 'FILTER_RED';

export const filterGreenBills = isGreenBills => {
    return {type: FILTER_GREEN, isGreenBills: isGreenBills}
};

export const filterOrangeBills = isOrangeBills => {
    return {type: FILTER_ORANGE, isOrangeBills: isOrangeBills}
}

export const filterRedBills = isRedBills => {
    return {type: FILTER_RED, isRedBills: isRedBills}
}