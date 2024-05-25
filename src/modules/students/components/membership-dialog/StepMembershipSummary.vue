<script setup lang="ts">
import { MembershipDTO } from '../../models/membership';

const props = withDefaults(
    defineProps<{
        membershipStudent: MembershipDTO;
    }>(),
    {}
);
const emits = defineEmits(['previousStep', 'nextStep']);
</script>
<template>
    <q-form>
        {{ props.membershipStudent }}
    </q-form>
    <q-stepper-navigation>
        <q-btn color="primary" @click="emits('nextStep')" label="Finish" />
        <q-btn
            flat
            @click="emits('previousStep')"
            color="primary"
            label="Back"
            class="q-ml-sm"
        />
    </q-stepper-navigation>
</template>
