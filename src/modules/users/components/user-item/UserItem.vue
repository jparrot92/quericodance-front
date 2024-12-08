<script setup lang="ts">
import { useRouter } from 'vue-router';
import { UserDTO } from 'src/model/user.model';

const props = withDefaults(
    defineProps<{
        userItem: UserDTO;
    }>(),
    {}
);

const router = useRouter();

const handleItemClick = (user: UserDTO) => {
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
            <q-item-section avatar top>
                <q-avatar v-if="props.userItem.photo">
                    <img :src="props.userItem.photo" />
                </q-avatar>
                <q-avatar
                    v-else
                    color="grey"
                    text-color="white"
                    icon="mdi-image-off"
                />
            </q-item-section>
            <q-item-section>
                <q-item-label lines="1">
                    {{ props.userItem.name }} {{ props.userItem.surnames }}
                </q-item-label>
                <q-item-label lines="1">
                    {{ props.userItem.email }}
                </q-item-label>
                <q-item-label lines="2">
                    <div
                        v-for="(role, index) in props.userItem.roles"
                        :key="index"
                    >
                        <q-badge color="blue" :label="role" />
                    </div>
                </q-item-label>
            </q-item-section>
            <q-item-section side top>
                <slot name="menu"> </slot>
            </q-item-section>
        </q-item>
        <q-separator inset="item" />
    </div>
</template>
