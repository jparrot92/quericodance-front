<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { format } from '@formkit/tempo';

import useAuth from 'src/modules/auth/composables/useAuth';

import { AbsenceDTO } from 'src/modules/activities/models/absence';

const emits = defineEmits(['deleteActivitiesAbsence']);

const props = withDefaults(
    defineProps<{
        absences?: AbsenceDTO[];
    }>(),
    {}
);

const { t } = useI18n();
const { isAdmin } = useAuth();
</script>

<template>
    <q-list
        v-for="absence in props.absences"
        :key="absence.id"
        bordered
        class="rounded-borders"
    >
        <q-item>
            <q-item-section top>
                <q-item-label caption lines="1">
                    {{ t('student.absenceDate') }}
                </q-item-label>
                <q-item-label lines="1">
                    {{ format(absence.absenceDate) }}
                </q-item-label>
            </q-item-section>

            <q-item-section top side>
                <div v-if="isAdmin()" class="text-grey-8 q-gutter-xs">
                    <q-btn
                        class="gt-xs"
                        size="12px"
                        flat
                        dense
                        round
                        icon="delete"
                        @click="emits('deleteActivitiesAbsence', absence.id)"
                    />
                </div>
            </q-item-section>
        </q-item>
    </q-list>
</template>
