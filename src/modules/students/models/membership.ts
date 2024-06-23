import { Tariff } from 'src/modules/services/modules/tariffs/models/tariff';
import {
    MembershipActivityDTO,
    MembershipActivityViewDTO,
} from './membershipActivity';

export interface MembershipDTO {
    id: number;
    studentId: number;
    tariffId: number;
    paymentFrequency: string;
    membershipActivities?: MembershipActivityDTO[];
}

export interface MembershipViewDTO {
    id: number;
    payment?: number;
    paymentDate?: Date;
    paymentFrequency: string;
    paymentStatus: string;
    tariff: Tariff;
    updateAt: Date;
    membershipActivities?: MembershipActivityViewDTO[];
}
