<script setup lang="ts">
import { ref, watch, defineProps, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { deletePhoto, uploadPhoto } from 'src/api/usersApi';

const { t } = useI18n();

interface Props {
    id: number;
    photo?: string;
}

const props = defineProps<Props>();

const id = ref<number>(props.id);
const userPhoto = ref<string>('src/assets/sinFoto.png');

watch(
    () => props.photo,
    (newPhoto) => {
        if (newPhoto) {
            userPhoto.value = newPhoto;
        }
    }
);

onMounted(() => {
    if (props.photo) {
        userPhoto.value = props.photo;
    }
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

        let photoURL = await uploadPhoto(id.value, file);
        userPhoto.value = photoURL;
        showDialog.value = false;
    }
};

const choosePicture = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

const deletePicture = async () => {
    await deletePhoto(id.value);
    userPhoto.value = './assets/sinFoto.png';
    showDialog.value = false;
};
</script>

<template>
    <q-avatar size="150px">
        <q-img :src="userPhoto" :ratio="1" />
        <q-icon
            class="absolute all-pointer-events"
            size="32px"
            name="mdi-camera"
            color="primary"
            style="top: 8px; left: 115px; cursor: pointer"
            @click="showDialog = true"
        >
            <q-tooltip>{{ $t('shared.label.selectProfilePhoto') }}</q-tooltip>
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
                    {{ $t('shared.label.selectProfilePhoto') }}
                </div>
            </q-card-section>

            <q-list bordered separator>
                <q-item clickable v-ripple @click="choosePicture">
                    <q-item-section class="text-center text-bold text-positive">
                        {{ $t('shared.label.selectPhoto') }}
                    </q-item-section>
                </q-item>

                <q-item clickable v-ripple @click="deletePicture">
                    <q-item-section class="text-center text-bold text-negative">
                        {{ $t('shared.label.deleteCurrentPhoto') }}
                    </q-item-section>
                </q-item>

                <q-item clickable v-ripple @click="showDialog = false">
                    <q-item-section class="text-center">
                        {{ $t('shared.label.cancel') }}
                    </q-item-section>
                </q-item>
            </q-list>
        </q-card>
    </q-dialog>
</template>
