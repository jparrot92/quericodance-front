<script setup lang="ts">
import { ref, watch, defineProps, onMounted } from 'vue';

import useNotify from 'src/shared/composables/useNotify';
import { deletePhoto, uploadPhoto } from 'src/api/usersApi';

const { notifyError } = useNotify();

interface Props {
    id: number;
    photo?: string;
}

const props = withDefaults(defineProps<Props>(), {
    photo: '',
});

const photoURL = ref<string>('');

watch(props, () => {
    photoURL.value = props.photo || '';
});

onMounted(() => {
    photoURL.value = props.photo || '';
});

const fileInput = ref<HTMLInputElement | null>(null);
const showDialog = ref<boolean>(false);

const handleImageChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file && file.type.startsWith('image/')) {
        /*const reader = new FileReader();
        reader.onload = () => {
            selectedImage.value = reader.result as string;
            showDialog.value = false;
        };
        reader.readAsDataURL(file);*/

        try {
            photoURL.value = await uploadPhoto(props.id, file);
            showDialog.value = false;
        } catch (error) {
            notifyError(error);
        }
    }
};

const choosePicture = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

const deletePicture = async () => {
    await deletePhoto(props.id);
    photoURL.value = '';
    showDialog.value = false;
};
</script>

<template>
    <q-avatar size="150px">
        <q-img v-if="photoURL === ''" src="~assets/sinFoto.png" :ratio="1" />
        <q-img v-else :src="photoURL" :ratio="1" />
        <q-icon
            class="absolute all-pointer-events"
            size="32px"
            name="mdi-camera"
            color="primary"
            style="top: 8px; left: 115px; cursor: pointer"
            @click="showDialog = true"
        >
            <q-tooltip>{{ $t('shared.selectProfilePhoto') }}</q-tooltip>
        </q-icon>
    </q-avatar>

    <input
        type="file"
        ref="fileInput"
        accept="image/*"
        @change="handleImageChange"
        style="display: none"
    />

    <q-dialog v-model="showDialog">
        <q-card style="width: 500px; max-width: 60vw">
            <q-card-section>
                <div class="text-center text-h6">
                    {{ $t('shared.selectProfilePhoto') }}
                </div>
            </q-card-section>

            <q-list bordered separator>
                <q-item clickable v-ripple @click="choosePicture">
                    <q-item-section class="text-center text-bold text-positive">
                        {{ $t('shared.selectPhoto') }}
                    </q-item-section>
                </q-item>

                <q-item clickable v-ripple @click="deletePicture">
                    <q-item-section class="text-center text-bold text-negative">
                        {{ $t('shared.deleteCurrentPhoto') }}
                    </q-item-section>
                </q-item>

                <q-item clickable v-ripple @click="showDialog = false">
                    <q-item-section class="text-center">
                        {{ $t('shared.cancel') }}
                    </q-item-section>
                </q-item>
            </q-list>
        </q-card>
    </q-dialog>
</template>
