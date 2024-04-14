export interface ColumnTable {
    name: string;
    label: string;
    field:
        | string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        | ((row: any) => string | number | boolean | Date | undefined);
    align?: 'left' | 'right' | 'center';
    format?: (val: number) => string;
    sortable?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sort?: void | any;
    headerStyle?: string;
}

export interface Option {
    label: string;
    value: string;
}

export enum PaymentsStatus {
    PAYED = 'payed',
    PENDING = 'pending',
}

export enum Status {
    ACTIVE = 'active',
    DISABLED = 'disabled',
}

export enum DanceRole {
    LEADER = 'leader',
    FOLLOWER = 'follower',
}

export enum WeekDay {
    SUNDAY = 'SU',
    MONDAY = 'MO',
    TUESDAY = 'TU',
    WEDNESDAY = 'WE',
    THURSDAY = 'TH',
    FRIDAY = 'FR',
    SATURDAY = 'SA',
}

export enum SessionFrequency {
    WEEKLY = 'weekly',
    UNLIMITED = 'unlimited',
}

export enum PaymentFrequency {
    MONTHLY = 'monthly',
    TRIMESTRAL = 'trimestral',
}
