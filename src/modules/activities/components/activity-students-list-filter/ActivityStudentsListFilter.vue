<script setup lang="ts">
import { ref } from 'vue';

import { PaymentsStatus, DanceRole } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';

import { StudentFilter } from 'src/modules/students/models/student';

const { generateEnumOptions } = useEnumOptions();

interface Emits {
    (e: 'filterTable', studentFilter: StudentFilter): void;
}

const emits = defineEmits<Emits>();

const studentFilter = ref<StudentFilter>({
    textFilter: '',
    paymentStatus: null,
});

const paymentStatuses = generateEnumOptions(PaymentsStatus);
const danceRoles = generateEnumOptions(DanceRole);

const initPayment = () => {
    studentFilter.value.paymentStatus = null;
    emits('filterTable', studentFilter.value);
};

const initDanceRole = () => {
    studentFilter.value.danceRole = null;
    emits('filterTable', studentFilter.value);
};
</script>

<template>
    <div class="col-12">
        <div class="row">
            <q-input
                class="col-6"
                v-model="studentFilter.textFilter"
                dense
                :label="$t('shared.label.search')"
                :placeholder="$t('student.label.serachPlaceholder')"
                @update:model-value="emits('filterTable', studentFilter)"
            />
            <q-select
                class="q-ml-sm col-2"
                dense
                v-model="studentFilter.paymentStatus"
                :options="paymentStatuses"
                :label="$t('student.label.paymentStatus')"
                @update:model-value="emits('filterTable', studentFilter)"
            >
                <template v-slot:append>
                    <q-icon
                        v-if="studentFilter.paymentStatus !== null"
                        class="cursor-pointer"
                        name="clear"
                        @click.stop.prevent="initPayment"
                    />
                </template>
            </q-select>
            <q-select
                class="q-ml-sm col-2"
                dense
                v-model="studentFilter.danceRole"
                :options="danceRoles"
                :label="$t('student.label.role')"
                @update:model-value="emits('filterTable', studentFilter)"
            >
                <template v-slot:append>
                    <q-icon
                        v-if="studentFilter.danceRole !== null"
                        class="cursor-pointer"
                        name="clear"
                        @click.stop.prevent="initDanceRole"
                    />
                </template>
            </q-select>
        </div>
    </div>
</template>
