<script setup lang="ts">
import { useRouter } from 'vue-router';

import { TariffDTO } from 'src/interfaces/tariff/tariff';

const props = withDefaults(
    defineProps<{
        tariffItem: TariffDTO;
    }>(),
    {}
);

const router = useRouter();

const handleItemClick = (tariff: TariffDTO) => {
    router.push({
        name: 'tariffs-edit',
        params: {
            id: tariff.id,
        },
    });
};
</script>

<template>
    <div padding class="full-width">
        <q-item clickable v-ripple @click="handleItemClick(props.tariffItem)">
            <q-item-section>
                <q-item-label lines="1">
                    {{ props.tariffItem.name }}
                </q-item-label>
            </q-item-section>
            <q-item-section side top>
                <slot name="menu"> </slot>
            </q-item-section>
        </q-item>
        <q-separator />
    </div>
</template>
