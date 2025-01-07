<script setup lang="ts">
import { ref } from 'vue';
import useStudents from '../../composables/useStudents';

const props = withDefaults(
    defineProps<{
        idActivity: string;
    }>(),
    {
        idActivity: '',
    }
);

const {
    students,
    loadStudents,
    resetPayments,
    handleFileUpload,
    handleFileDownload,
    handleFileDownloadTemplate,
} = useStudents();

const fileInput = ref<HTMLInputElement | null>(null);

const handleResetPayments = async () => {
    try {
        await resetPayments();
        await loadStudents('');
        studentsFiltered.value = students.value;
    } catch (error) {
        console.error(error);
    }
};

const chooseFile = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};
</script>
<template>
    <template v-if="$q.screen.xs">
        <template v-if="props.idActivity">
            <q-page-sticky position="bottom-right" :offset="[18, 18]">
                <q-btn
                    fab
                    icon="mdi-plus"
                    color="primary"
                    @click="
                        $router.push({
                            name: 'students-add',
                        })
                    "
                />
            </q-page-sticky>
        </template>
        <template v-else>
            <q-page-sticky
                v-if="$q.screen.xs"
                position="bottom-right"
                :offset="[18, 18]"
                class="z-top"
            >
                <q-fab
                    color="primary"
                    direction="up"
                    vertical-actions-align="right"
                >
                    <template v-slot:icon="{ opened }">
                        <q-icon
                            :class="{
                                'example-fab-animate--hover': opened !== true,
                            }"
                            name="keyboard_arrow_up"
                        />
                    </template>

                    <template v-slot:active-icon="{ opened }">
                        <q-icon
                            :class="{ 'example-fab-animate': opened === true }"
                            name="close"
                        />
                    </template>

                    <q-fab-action
                        label-position="left"
                        color="primary"
                        @click="
                            $router.push({
                                name: 'students-add',
                            })
                        "
                        icon="mdi-plus"
                        :label="$t('student.createStudent')"
                    />

                    <q-fab-action
                        label-position="left"
                        color="green"
                        @click="onClick"
                        icon="file_present"
                        :label="$t('shared.excel')"
                    />

                    <q-fab-action
                        label-position="left"
                        color="green"
                        @click="handleResetPayments"
                        icon="mdi-restart"
                        :label="$t('shared.resetPayments')"
                    />
                </q-fab>
            </q-page-sticky>
        </template>
    </template>
    <template v-else>
        <template v-if="props.idActivity">
            <q-space></q-space>
            <q-btn
                :label="$t('student.createStudent')"
                color="primary"
                icon="mdi-plus"
                dense
                @click="
                    $router.push({
                        name: 'students-add',
                    })
                "
            />
        </template>
        <template v-else>
            <q-space></q-space>
            <q-btn
                class="q-mr-sm"
                :label="$t('shared.resetPayments')"
                color="green"
                icon="mdi-restart"
                dense
                @click="handleResetPayments"
            />
            <q-btn-dropdown
                class="q-mr-sm"
                :label="$t('shared.excel')"
                color="green"
                icon="file_present"
                dense
            >
                <q-list>
                    <q-item
                        clickable
                        v-close-popup
                        @click="handleFileDownloadTemplate"
                    >
                        <q-item-section>
                            <q-item-label>
                                {{ $t('shared.downloadExcelTemplate') }}
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="chooseFile">
                        <q-item-section>
                            <q-item-label>
                                {{ $t('shared.importExcel') }}
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="handleFileDownload">
                        <q-item-section>
                            <q-item-label>
                                {{ $t('shared.downloadExcel') }}
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
            <input
                type="file"
                ref="fileInput"
                accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                @change="handleFileUpload"
                style="display: none"
            />
            <q-btn
                :label="$t('student.createStudent')"
                color="primary"
                icon="mdi-plus"
                dense
                @click="
                    $router.push({
                        name: 'students-add',
                    })
                "
            />
        </template>
    </template>
</template>
