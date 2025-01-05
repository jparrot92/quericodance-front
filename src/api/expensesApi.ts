import { api } from 'boot/axios';
import { handleError } from './errorApi';
import { ExpenseDTO } from 'src/model/expense.model';

const expensesEndpoint = '/expenses';

export default {
    getExpenses: async (): Promise<ExpenseDTO[]> => {
        try {
            const { data } = await api.get<ExpenseDTO[]>(expensesEndpoint);
            return data;
        } catch (error) {
            throw handleError(error);
        }
    },

    getExpense: async (id: string): Promise<ExpenseDTO> => {
        try {
            const { data } = await api.get<ExpenseDTO>(
                `${expensesEndpoint}/${id}`
            );
            return data;
        } catch (error) {
            throw handleError(error);
        }
    },

    createExpense: async (expense: ExpenseDTO): Promise<ExpenseDTO> => {
        try {
            const { data } = await api.post<ExpenseDTO>(
                expensesEndpoint,
                expense
            );
            return data;
        } catch (error) {
            throw handleError(error);
        }
    },

    updateExpense: async (
        id: string,
        expense: ExpenseDTO
    ): Promise<ExpenseDTO> => {
        try {
            const { data } = await api.put<ExpenseDTO>(
                `${expensesEndpoint}/${id}`,
                expense
            );
            return data;
        } catch (error) {
            throw handleError(error);
        }
    },

    deleteExpense: async (id: number): Promise<ExpenseDTO> => {
        try {
            const { data } = await api.delete<ExpenseDTO>(
                `${expensesEndpoint}/${id}`
            );
            return data;
        } catch (error) {
            throw handleError(error);
        }
    },
};
