<script setup lang="ts">
import { useRouter } from 'vue-router';

import { User } from '../../models/user';

const props = withDefaults(
    defineProps<{
        userItem: User;
    }>(),
    {}
);

const router = useRouter();

const handleItemClick = (user: User) => {
    router.push({
        name: 'users-edit',
        params: {
            id: user.id,
        },
    });
};
</script>

<template>
    <div padding class="full-width">
        <q-item clickable v-ripple @click="handleItemClick(props.userItem)">
            <q-item-section>
                <q-item-label lines="1">
                    {{ props.userItem.name }}
                </q-item-label>
            </q-item-section>
            <q-item-section side top>
                <slot name="menu"> </slot>
            </q-item-section>
        </q-item>
        <q-separator />
    </div>
</template>
