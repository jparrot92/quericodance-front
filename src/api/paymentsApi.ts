import { api } from 'boot/axios';
import { handleError } from './errorApi';
import { PaymentDTO, TotalAmountsDTO } from 'src/model/finance.model';

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
