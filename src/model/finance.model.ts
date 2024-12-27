import { PaymentFrequency, PaymentsStatus } from 'src/types/UtilTypes';
import { StudentDTO } from './student.model';
import { TariffDTO } from './tariff.model';

export interface MembershipDTO {
    id: number;
    studentId: number;
    tariffId: number;
    paymentFrequency: string;
    discountPercentage: number;
    discountReason: string;
}

export interface MembershipViewDTO {
    id: number;
    payment: number;
    paymentDate?: Date;
    paymentFrequency: PaymentFrequency;
    paymentStatus: PaymentsStatus;
    tariff: TariffDTO;
    discountPercentage?: number;
    discountReason?: string;
    dueDate: Date;
    updateAt: Date;
}

export interface PaymentDTO {
    paymentMethod: string;
}

export interface PaymentViewDTO {
    id: number;
    periodCode: string;
    paymentType: string;
    paymentMethod: string;
    student?: StudentDTO;
    amount: number;
    status: string;
    paymentDate: string | null;
}

export interface TotalAmountsDTO {
    pendingTotal: number;
    payedTotal: number;
}
