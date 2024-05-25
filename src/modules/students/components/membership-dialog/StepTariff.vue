<script setup lang="ts">
import { onMounted, defineProps, ref } from 'vue';
import { PaymentFrequency } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';

import useTariffs from 'src/modules/services/modules/tariffs/composables/useTariffs';
import useMemberships from 'src/modules/students/composables/useMemberships';
import { MembershipDTO } from '../../models/membership';
import { Tariff } from 'src/modules/services/modules/tariffs/models/tariff';

const props = withDefaults(
    defineProps<{
        membershipStudent: MembershipDTO;
    }>(),
    {}
);
const emits = defineEmits(['nextStep']);

const { generateEnumOptions } = useEnumOptions();
const { tariffs, loadTariffs } = useTariffs();
const { membership } = useMemberships();

const paymentFrequency = generateEnumOptions(PaymentFrequency);
const tariff = ref<Tariff>();

onMounted(async () => {
    await loadTariffs();

    if (props.membershipStudent) {
        membership.value = props.membershipStudent;
        tariff.value = tariffs.value.find(
            (tariff) => tariff.id === membership.value.tariffId
        );
    }
});
</script>
<template>
    <q-form>
        <q-select
            v-model="tariff"
            :label="$t('student.tariff')"
            :options="tariffs"
            :option-value="'id'"
            @update:model-value="tariff && (membership.tariffId = tariff.id)"
        >
            <template v-slot:selected-item="{ opt }">
                {{ opt.name + ' - ' + opt.price + '€' }}
            </template>
            <template v-slot:option="{ itemProps, opt }">
                <q-item v-bind="itemProps">
                    <q-item-section>
                        {{ opt.name + ' - ' + opt.price + '€' }}
                    </q-item-section>
                </q-item>
            </template>
        </q-select>

        <pd-select
            v-model="membership.paymentFrequency"
            :label="$t('student.paymentFrequency')"
            :options="paymentFrequency"
        />
    </q-form>
    <q-stepper-navigation>
        <q-btn @click="emits('nextStep')" color="primary" label="Continue" />
    </q-stepper-navigation>
</template>
