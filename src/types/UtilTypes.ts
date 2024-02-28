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
