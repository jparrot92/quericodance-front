const saveFiltersToLocalStorage = (filtersSelected: object) => {
    sessionStorage.setItem('filtersSelected', JSON.stringify(filtersSelected));
};

const loadFiltersFromLocalStorage = (filtersSelected: object) => {
    const savedFilters = sessionStorage.getItem('filtersSelected');
    if (savedFilters) {
        if (JSON.parse(savedFilters).id !== filtersSelected.id) {
            sessionStorage.removeItem('filtersSelected');
        } else {
            if (!filtersSelected.child) {
                Object.assign(filtersSelected, JSON.parse(savedFilters));
            }
        }
    }
};

const removeFiltersFromLocalStorage = () => {
    sessionStorage.removeItem('filtersSelected');
};

export default function useLocalStorageFilters() {
    return {
        saveFiltersToLocalStorage,
        loadFiltersFromLocalStorage,
        removeFiltersFromLocalStorage,
    };
}
