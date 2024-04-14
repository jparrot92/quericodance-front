<script setup lang="ts">
import PersonalClassList from '../components/personal-class-list/PersonalClassList.vue';
</script>

<template>
    <q-page padding>
        <personal-class-list />
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
