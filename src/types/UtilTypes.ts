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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Action<T = any> {
    // T es un tipo genérico que puede ser cualquier cosa
    label: string;
    action: (row: T) => void; // Acción que toma un parámetro de tipo T
    show: (row?: T) => boolean; // Condición que toma un parámetro de tipo T
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
    NEW = 'new',
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum DanceRole {
    LEADER = 'leader',
    FOLLOWER = 'follower',
}

export enum WeekDay {
    MONDAY = 'MO',
    TUESDAY = 'TU',
    WEDNESDAY = 'WE',
    THURSDAY = 'TH',
    FRIDAY = 'FR',
    SATURDAY = 'SA',
    SUNDAY = 'SU',
}

export enum SessionFrequency {
    WEEKLY = 'weekly',
    UNLIMITED = 'unlimited',
}

export enum PaymentFrequency {
    MONTHLY = 'monthly',
    TRIMESTRAL = 'trimestral',
}

export enum PaymentType {
    MEMBERSHIP = 'membership',
    BONUS = 'bonus',
    OTHER = 'other',
}

export enum ActivityType {
    CLASS = 'class',
    EVENT = 'event',
}

export enum PayType {
    CASH = 'cash',
    CREDIT_CARD = 'credit_card',
    BANK_TRANSFER = 'bank_transfer',
    OTHER = 'other',
}
