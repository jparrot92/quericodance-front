<script setup lang="ts">
import { MembershipDTO } from '../../models/membership';

const props = withDefaults(
    defineProps<{
        membershipStudent: MembershipDTO;
    }>(),
    {}
);
const emits = defineEmits(['close', 'previousStep', 'nextStep']);
</script>
<template>
    <q-form>
        {{ props.membershipStudent }}
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
