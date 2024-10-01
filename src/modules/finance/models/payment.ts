import { StudentDTO } from 'src/modules/students/models/student';

export interface PaymentDTO {
    id: number;
    periodCode: string;
    paymentType: string;
    student: StudentDTO;
    amount: number;
    status: string;
    paymentDate: string | null;
}
