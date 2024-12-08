<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { format } from '@formkit/tempo';
import { AbsenceDTO } from 'src/model/activity.model';

import useAuth from 'src/modules/auth/composables/useAuth';

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
    <q-list bordered>
        <template v-for="absence in props.absences" :key="absence.id">
            <q-item>
                <q-item-section top>
                    <q-item-label caption lines="1" class="q-pl-lg">
                        {{ t('student.absenceDate') }}
                    </q-item-label>
                    <q-item-label lines="1" class="q-pl-lg">
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
                            @click="
                                emits('deleteActivitiesAbsence', absence.id)
                            "
                        />
                    </div>
                </q-item-section>
            </q-item>
            <q-separator />
        </template>
    </q-list>
</template>
