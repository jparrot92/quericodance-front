import { StudentDTO } from 'src/interfaces/student/student';

export interface PaymentDTO {
    id: number;
    periodCode: string;
    paymentType: string;
    student?: StudentDTO;
    amount: number;
    status: string;
    paymentDate: string | null;
}

export interface TotalAmountsDTO {
    pendingTotal: number;
    payedTotal: number;
}
