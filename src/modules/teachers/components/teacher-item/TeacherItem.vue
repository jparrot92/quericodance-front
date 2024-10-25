<script setup lang="ts">
import { useRouter } from 'vue-router';

import { Teacher } from '../../models/teacher';

const props = withDefaults(
    defineProps<{
        teacherItem: Teacher;
    }>(),
    {}
);

const router = useRouter();

const handleItemClick = (teacher: Teacher) => {
    router.push({
        name: 'teachers-edit',
        params: {
            id: teacher.id,
        },
    });
};
</script>

<template>
    <div padding class="full-width">
        <q-item clickable v-ripple @click="handleItemClick(props.teacherItem)">
            <q-item-section>
                <q-item-label lines="1">
                    {{ props.teacherItem.user.name }}
                </q-item-label>
            </q-item-section>
            <q-item-section side top>
                <slot name="menu"> </slot>
            </q-item-section>
        </q-item>
        <q-separator />
    </div>
</template>
