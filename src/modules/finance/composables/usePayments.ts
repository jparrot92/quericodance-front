import { ref } from 'vue';

import useNotify from 'src/shared/composables/useNotify';

import useDates from 'src/composables/useDates';

import { listPayments } from 'src/api/paymentsApi';

import { PaymentDTO } from '../models/payment';

const usePayments = () => {
    const { notifyError } = useNotify();

    const { convertToYearMonth } = useDates();

    const loading = ref<boolean>(false);
    const payments = ref<PaymentDTO[]>([]);

    const loadPayments = async (period: string) => {
        try {
            payments.value = [];
            loading.value = true;

            payments.value = await listPayments(convertToYearMonth(period));
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        payments,
        loadPayments,
    };
};

export default usePayments;
