<script setup lang="ts">
import { useRouter } from 'vue-router';

import { Bonus } from '../../models/bonus';

const props = withDefaults(
    defineProps<{
        bonusItem: Bonus;
    }>(),
    {}
);

const router = useRouter();

const handleItemClick = (bonus: Bonus) => {
    router.push({
        name: 'bonuses-edit',
        params: {
            id: bonus.id,
        },
    });
};
</script>

<template>
    <div padding class="full-width">
        <q-item clickable v-ripple @click="handleItemClick(props.bonusItem)">
            <q-item-section>
                <q-item-label lines="1">
                    {{ props.bonusItem.name }}
                </q-item-label>
            </q-item-section>
            <q-item-section side top>
                <slot name="menu"> </slot>
            </q-item-section>
        </q-item>
        <q-separator />
    </div>
</template>
