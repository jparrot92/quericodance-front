export interface FilterField {
    field: string;
    label: string;
    options?: Array<object>;
    type: FilterFieldType;
}

export enum FilterFieldType {
    SELECT = 'select',
    INPUT = 'input',
}
