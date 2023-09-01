<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const UserList = defineAsyncComponent(
    () => import('src/modules/users/components/user-list/UserList.vue')
);
</script>

<template>
    <q-page padding>
        <UserList />
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn
                v-if="$q.platform.is.mobile"
                fab
                icon="mdi-plus"
                color="primary"
                :to="{ name: 'users-add' }"
            />
        </q-page-sticky>
    </q-page>
</template>
