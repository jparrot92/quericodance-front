<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import useExpenses from '../composables/useExpenses';

const route = useRoute();

const idExpense = computed<string | undefined>(() =>
    route.params.id?.toString()
);

const { expense, getExpense, createExpense, updateExpense } = useExpenses();

const onSubmit = async () => {
    if (idExpense.value) {
        updateExpense(idExpense.value);
    } else {
        createExpense();
    }
};

onMounted(() => {
    if (idExpense.value) {
        getExpense(idExpense.value);
    }
});
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <q-form
                class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
                @submit.prevent="onSubmit"
            >
                <q-input
                    :label="$t('expense.description') + '*'"
                    v-model="expense.description"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required')
                    ]"
                />

                <q-input
                    type="number"
                    :label="$t('expense.amount') + '*'"
                    v-model.number="expense.amount"
                    :rules="[
                        (val) =>
                            (val !== null &&
                                val !== undefined &&
                                val.toString().trim() !== '') ||
                            $t('shared.validations.required'),
                    ]"
                />

                <pd-date
                    :label="$t('expense.expenseDate')"
                    v-model="expense.expenseDate"
                    required
                />

                <q-btn
                    :label="$t('shared.save')"
                    color="primary"
                    class="full-width"
                    rounded
                    type="submit"
                />
            </q-form>
        </div>
    </q-page>
</template>
