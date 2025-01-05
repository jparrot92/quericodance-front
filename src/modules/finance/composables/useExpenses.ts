import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import expensesApi from 'src/api/expensesApi';

import { ExpenseDTO } from 'src/model/expense.model';

import useNotify from 'src/shared/composables/useNotify';

const useExpenses = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const expenses = ref<ExpenseDTO[]>([]);
    const expense = ref<ExpenseDTO>({
        id: 0,
        description: '',
        amount: 0,
        expenseDate: new Date(),
    });

    const getExpenses = async () => {
        try {
            expenses.value = [];
            loading.value = true;
            expenses.value = await expensesApi.getExpenses();
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const getExpense = async (id: string) => {
        try {
            loading.value = true;
            expense.value = await expensesApi.getExpense(id);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const createExpense = async () => {
        try {
            loading.value = true;
            const expenseData = await expensesApi.createExpense(expense.value);
            notifySuccess(t('expense.createdSuccessfully'));
            router.replace({
                name: 'expenses-edit',
                params: { id: expenseData.id },
            });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const updateExpense = async (id: string) => {
        try {
            loading.value = true;
            expense.value = await expensesApi.updateExpense(id, expense.value);
            notifySuccess(t('expense.updatedSuccessfully'));
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const deleteExpense = async (id: number) => {
        $q.dialog({
            title: t('shared.confirmation'),
            message: t('expense.delete'),
            cancel: true,
            persistent: true,
        }).onOk(async () => {
            try {
                await expensesApi.deleteExpense(id);
                notifySuccess(t('expense.deleteSuccessfully'));
                await getExpenses();
            } catch (error) {
                notifyError(error);
            }
        });
    };

    return {
        // Properties
        loading,
        expenses,
        expense,
        getExpenses,
        getExpense,
        createExpense,
        updateExpense,
        deleteExpense,
    };
};

export default useExpenses;
