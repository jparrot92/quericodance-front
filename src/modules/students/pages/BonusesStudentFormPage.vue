<script setup lang="ts">
import { defineProps, ref } from 'vue';

import MenuList from 'src/shared/components/MenuList.vue';

import AddBonusStudentDialog from '../components/AddBonusStudentDialog.vue';
import { BonusStudentDTO } from '../models/bonusStudent';
import useBonuses from 'src/modules/services/modules/bonuses/composables/useBonuses';

const emits = defineEmits(['update-bonuses-student']);

const props = withDefaults(
    defineProps<{
        idStudent: number;
        bonusesStudent?: BonusStudentDTO[];
    }>(),
    {
        bonusesStudent: () => [],
    }
);

const { removeBonusStudent } = useBonuses();

const showModalAddActivity = ref(false);
const bonusesStudentList = ref<BonusStudentDTO[]>(props.bonusesStudent);

const addBonusStudent = (bonusesStudent: BonusStudentDTO[]) => {
    bonusesStudentList.value = bonusesStudent;
    emits('update-bonuses-student', bonusesStudent);
};

const deleteBonusStudent = async (id: number) => {
    try {
        const bonusesStudent = await removeBonusStudent(id);
        bonusesStudentList.value = bonusesStudent;
        emits('update-bonuses-student', bonusesStudent);
    } catch (error) {
        console.error(error);
    }
};
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md">
                <q-list
                    v-if="bonusesStudentList.length > 0"
                    bordered
                    class="rounded-borders"
                >
                    <template
                        v-for="(item, index) in bonusesStudentList"
                        :key="item.id"
                    >
                        <q-item>
                            <q-item-section top>
                                <q-item-label lines="1">
                                    <span class="text-weight-medium">
                                        {{ $t('student.bonus') }}
                                        {{ item.bonus.name }}
                                    </span>
                                    <span class="text-grey-8">
                                        -
                                        {{ $t('student.sessions') }}
                                        {{ item.bonus.sessions }}
                                    </span>
                                </q-item-label>
                                <q-item-label caption lines="1">
                                    {{ item.bonus.price }} €
                                </q-item-label>
                            </q-item-section>

                            <q-item-section top side>
                                <div class="text-grey-8 q-gutter-xs">
                                    <menu-list>
                                        <q-item clickable v-close-popup>
                                            <q-item-section
                                                @click="
                                                    deleteBonusStudent(item.id)
                                                "
                                            >
                                                {{
                                                    $t('activity.label.delete')
                                                }}
                                            </q-item-section>
                                        </q-item>
                                    </menu-list>
                                </div>
                            </q-item-section>
                        </q-item>
                        <q-separator
                            spaced
                            v-if="index < bonusesStudentList.length - 1"
                        />
                    </template>
                </q-list>

                <q-card flat v-else>
                    <q-banner class="bg-info text-white">
                        {{ $t('student.messageAddBonus') }}
                    </q-banner>
                </q-card>
                <q-btn
                    :label="$t('student.addBonus')"
                    color="primary"
                    class="full-width"
                    rounded
                    @click="showModalAddActivity = true"
                />
            </div>
        </div>
    </q-page>

    <AddBonusStudentDialog
        v-if="showModalAddActivity"
        :id-student="props.idStudent"
        @close="showModalAddActivity = false"
        @add-bonus-student="addBonusStudent"
    />
</template>
