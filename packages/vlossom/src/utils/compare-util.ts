function compareValues(aValue: unknown, bValue: unknown): number {
    if (aValue === null && bValue === null) {
        return 0;
    }
    if (aValue === null) {
        return 1;
    }
    if (bValue === null) {
        return -1;
    }

    if (typeof aValue !== typeof bValue) {
        return 0;
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
    }
    if (aValue instanceof Date && bValue instanceof Date) {
        return aValue.getTime() - bValue.getTime();
    }
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return Number(aValue) - Number(bValue);
    }
    if (typeof aValue === 'object' && typeof bValue === 'object') {
        return JSON.stringify(aValue).localeCompare(JSON.stringify(bValue));
    }

    return 0;
}

export const compareUtil = {
    compareValues,
};
