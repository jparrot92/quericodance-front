import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import useNotify from 'src/shared/composables/useNotify';

import useDates from 'src/composables/useDates';

import { listPayments } from 'src/api/paymentsApi';

import { PaymentDTO } from '../models/payment';

const usePayments = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

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
