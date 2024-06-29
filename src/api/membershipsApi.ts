import { api } from 'boot/axios';
import { handleError } from './errorApi';
import {
    MembershipDTO,
    MembershipViewDTO,
} from 'src/modules/students/models/membership';

const membershipsEndpoint = '/memberships';

api.defaults.headers.common['Authorization'] =
    'Bearer ' + localStorage.getItem('token');

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
