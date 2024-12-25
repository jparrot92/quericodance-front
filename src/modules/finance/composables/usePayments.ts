import { ref } from 'vue';

import { getTotalAmounts, listPayments } from 'src/api/paymentsApi';
import { PaymentViewDTO, TotalAmountsDTO } from 'src/model/finance.model';

import useNotify from 'src/shared/composables/useNotify';

import useDates from 'src/composables/useDates';

const usePayments = () => {
    const { notifyError } = useNotify();

    const { convertToYearMonth } = useDates();

    const loading = ref<boolean>(false);
    const payments = ref<PaymentViewDTO[]>([]);
    const totals = ref<TotalAmountsDTO | null>(null);

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

    const loadTotalAmounts = async (period: string) => {
        try {
            totals.value = null;
            loading.value = true;

            const periodCode = convertToYearMonth(period);

            totals.value = await getTotalAmounts(periodCode);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        payments,
        totals,
        loadPayments,
        loadTotalAmounts,
    };
};

export default usePayments;
