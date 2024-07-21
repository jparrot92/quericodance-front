<script setup lang="ts">
import { onMounted, defineProps, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

import useBonuses from 'src/modules/services/modules/bonuses/composables/useBonuses';
import { BonusStudentDTO } from '../models/bonusStudent';

const props = withDefaults(
    defineProps<{
        idStudent: number;
    }>(),
    {}
);

const emits = defineEmits(['close', 'add-bonus-student']);

const { bonuses, bonus, loadBonuses, saveBonusStudent } = useBonuses();

const isDialogVisible: Ref<boolean> = ref<boolean>(true);

const addBonusStudent = async () => {
    const newBonusStudent = await saveBonusStudent(
        props.idStudent,
        bonus.value.id
    );
    emits('add-bonus-student', newBonusStudent);
};

onMounted(() => {
    loadBonuses();
});
</script>

<template>
    <q-dialog v-model="isDialogVisible" @hide="emits('close')">
        <q-card style="width: 50vh">
            <q-card-section>
                <div class="text-h6">{{ $t('student.addBonus') }}</div>
            </q-card-section>

            <q-separator />

            <q-card-section style="max-height: 50vh" class="scroll">
                <q-select
                    v-model="bonus"
                    :label="$t('student.bonus')"
                    :options="bonuses"
                >
                    <template v-slot:selected-item="{ opt }">
                        {{ opt.name }}
                    </template>
                    <template v-slot:option="{ itemProps, opt }">
                        <q-item v-bind="itemProps">
                            <q-item-section>
                                {{ opt.name }}
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>

                <pd-field
                    :label="$t('student.sessions')"
                    :value="bonus.sessions"
                />

                <pd-field :label="$t('student.price')" :value="bonus.price" />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn
                    flat
                    :label="$t('student.add')"
                    color="primary"
                    @click="addBonusStudent()"
                />
                <q-btn
                    flat
                    :label="$t('student.cancel')"
                    color="primary"
                    @click="emits('close')"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
