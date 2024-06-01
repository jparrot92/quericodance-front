<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { MembershipViewDTO } from '../../models/membership';

const props = withDefaults(
    defineProps<{
        membership: MembershipViewDTO;
    }>(),
    {}
);
const emits = defineEmits(['close', 'previousStep', 'nextStep']);

const { t } = useI18n();
</script>
<template>
    <q-form>
        <pd-field
            :label="$t('student.tariff')"
            :value="props.membership.tariff.name"
        />

        <pd-field
            :label="$t('student.paymentFrequency')"
            :value="t('shared.enum.' + membership.paymentFrequency)"
        />
    </q-form>
    <q-stepper-navigation>
        <div class="row justify-between">
            <div class="row">
                <q-btn
                    flat
                    @click="emits('close')"
                    color="primary"
                    :label="$t('shared.cancel')"
                />
            </div>
            <div class="row">
                <q-btn
                    outline
                    @click="emits('previousStep')"
                    color="primary"
                    :label="$t('shared.back')"
                />

                <q-btn
                    class="q-ml-sm"
                    color="primary"
                    @click="emits('nextStep')"
                    :label="$t('shared.finish')"
                />
            </div>
        </div>
    </q-stepper-navigation>
</template>
