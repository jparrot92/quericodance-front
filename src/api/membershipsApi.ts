import { api } from 'boot/axios';
import { handleError } from './errorApi';
import {
    MembershipDTO,
    MembershipViewDTO,
    PaymentDTO,
} from 'src/model/finance.model';
import { StudentDTO } from 'src/model/student.model';

const membershipsEndpoint = '/memberships';

export const listMemberships = async (): Promise<MembershipDTO[]> => {
    try {
        const { data } = await api.get<MembershipDTO[]>(membershipsEndpoint);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getMembership = async (id: string): Promise<MembershipDTO> => {
    try {
        const { data } = await api.get<MembershipDTO>(
            `${membershipsEndpoint}/${id}`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createMembership = async (
    membership: MembershipDTO
): Promise<MembershipViewDTO> => {
    try {
        const { data } = await api.post<MembershipViewDTO>(
            membershipsEndpoint,
            membership
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateMembership = async (
    id: number,
    membership: MembershipDTO
): Promise<MembershipViewDTO> => {
    try {
        const { data } = await api.put<MembershipViewDTO>(
            `${membershipsEndpoint}/${id}`,
            membership
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteMembership = async (id: number): Promise<MembershipDTO> => {
    try {
        const { data } = await api.delete<MembershipDTO>(
            `${membershipsEndpoint}/${id}`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const resetPaymentsStatus = async (): Promise<string> => {
    try {
        const { data } = await api.post<string>(
            `${membershipsEndpoint}/reset-payments-status`
        );
        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const markPayment = async (
    id: number,
    payment: PaymentDTO
): Promise<StudentDTO> => {
    try {
        const { data } = await api.put<StudentDTO>(
            `${membershipsEndpoint}/${id}/make-payment`,
            payment
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const cancelPayment = async (id: number): Promise<StudentDTO> => {
    try {
        const { data } = await api.put<StudentDTO>(
            `${membershipsEndpoint}/${id}/cancel-payment`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
