import { api } from 'boot/axios';
import {
    PaymentDTO,
    TotalAmountsDTO,
} from 'src/modules/finance/models/payment';
import { handleError } from './errorApi';

const paymentsEndpoint = '/payments';

export const listPayments = async (
    periodCode: string
): Promise<PaymentDTO[]> => {
    try {
        const { data } = await api.get<PaymentDTO[]>(paymentsEndpoint, {
            params: {
                periodCode,
            },
        });

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getTotalAmounts = async (
    periodCode: string
): Promise<TotalAmountsDTO> => {
    try {
        const { data } = await api.get<TotalAmountsDTO>(
            `${paymentsEndpoint}/totals`,
            {
                params: {
                    periodCode,
                },
            }
        );
        return data;
    } catch (error) {
        throw handleError(error);
    }
};
