<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
    isOpen: boolean;
}
interface Emits {
    (e: 'onClose'): void;
}
const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const isOpenDialog = ref<boolean>(false);

watch(props, () => {
    isOpenDialog.value = props.isOpen;
});
</script>

<template>
    <q-dialog v-model="isOpenDialog" @hide="emits('onClose')">
        <q-card>
            <q-toolbar>
                <q-toolbar-title> Framework </q-toolbar-title>

                <q-btn
                    flat
                    round
                    dense
                    icon="close"
                    @click="emits('onClose')"
                    v-close-popup
                />
            </q-toolbar>

            <q-separator />

            <q-card-section style="max-height: 50vh" class="scroll">
                <p v-for="n in 15" :key="n">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Rerum repellendus sit voluptate voluptas eveniet porro.
                    Rerum blanditiis perferendis totam, ea at omnis vel numquam
                    exercitationem aut, natus minima, porro labore.
                </p>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn
                    @click="emits('onClose')"
                    flat
                    label="Decline"
                    color="primary"
                    v-close-popup
                />
                <q-btn flat label="Accept" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
