import { api } from 'boot/axios';
import { PaymentDto } from 'src/modules/finance/models/payment';
import { handleError } from './errorApi';

const paymentsEndpoint = '/payments';

export const listPayments = async (
    periodCode: string
): Promise<PaymentDto[]> => {
    try {
        const { data } = await api.get<PaymentDto[]>(paymentsEndpoint, {
            params: {
                periodCode,
            },
        });

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
