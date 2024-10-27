<script setup lang="ts">
import {
    defineProps,
    ref,
    onMounted,
    computed,
    onBeforeUnmount,
    ComputedRef,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useAuthStore } from '../../auth/store/auth-store';
import useAuth from '../../auth/composables/useAuth';

import AddBonusStudentDialog from '../components/AddBonusStudentDialog.vue';
import { BonusStudentDTO } from '../models/bonusStudent';
import useBonuses from 'src/modules/services/modules/bonuses/composables/useBonuses';
import { Action } from 'src/types/UtilTypes';

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

const { t } = useI18n();
const router = useRouter();
const { isStudent, isAdmin, refreshInfoStudent } = useAuth();
const authStore = useAuthStore();

const { removeBonusStudent } = useBonuses();

const showModalAddActivity = ref(false);
const bonusesStudentList = ref<BonusStudentDTO[]>(props.bonusesStudent);

const messageAddBonus = computed<string>(() =>
    isStudent()
        ? t('student.messageAddBonusStudent')
        : t('student.messageAddBonus')
);

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

const preventNav = async (event: BeforeUnloadEvent) => {
    await refreshInfoStudent();
    event.preventDefault();
    event.returnValue = '';
};

onMounted(() => {
    if (isStudent()) {
        window.addEventListener('beforeunload', preventNav);
        bonusesStudentList.value =
            authStore.user?.student?.bonusesStudent || [];
    }
});

onBeforeUnmount(() => {
    if (isStudent()) {
        window.removeEventListener('beforeunload', preventNav);
    }
});

// router.beforeEach(async (to, from, next) => {
//     if (isStudent()) {
//         await refreshInfoStudent();
//         next();
//     }
// });

const actions: ComputedRef<Action<BonusStudentDTO>[]> = computed(() => {
    return [
        {
            label: t('shared.delete'),
            action: (row: BonusStudentDTO) => deleteBonusStudent(row.id),
            show: () => true,
        },
    ];
});
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

                            <q-item-section top side v-if="isAdmin()">
                                <pd-menu-list
                                    v-if="isAdmin()"
                                    :actions="actions"
                                    :row="item"
                                />
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
                        {{ messageAddBonus }}
                    </q-banner>
                </q-card>
                <q-btn
                    v-if="isAdmin()"
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
