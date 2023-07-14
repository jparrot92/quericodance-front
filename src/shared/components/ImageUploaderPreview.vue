<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { useQuasar } from 'quasar';

import { deletePhoto, uploadPhoto } from 'src/api/userApi';

interface Props {
    id: string;
    photo?: string;
}

const props = defineProps<Props>();

const id = ref<string>(props.id);
const photo = ref<string | null>('');

watch(
    () => props.photo,
    (newPhoto) => {
        if (newPhoto) {
            photo.value = newPhoto;
        }
    }
);

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
        photo.value = photoURL;
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
    photo.value = '';
    showDialog.value = false;
};
</script>

<template>
    <q-avatar size="200px">
        <q-img :src="photo" no-native-menu>
            <q-btn
                class="absolute all-pointer-events"
                round
                color="primary"
                icon="shopping_cart"
                style="top: 8px; left: 140px"
                @click="showDialog = true"
            >
                <q-tooltip>Seleccionar foto de perfil</q-tooltip>
            </q-btn>
        </q-img>
    </q-avatar>
    <input
        type="file"
        ref="fileInput"
        accept="image/*"
        @change="handleImageChange"
    />

    <q-dialog v-model="showDialog">
        <q-card style="width: 500px; max-width: 60vw">
            <q-card-section>
                <div class="text-center text-h6">
                    Seleccionar foto del perfil
                </div>
            </q-card-section>

            <q-list bordered separator>
                <q-item clickable v-ripple @click="choosePicture">
                    <q-item-section class="text-center text-bold text-primary">
                        Seleccionar foto
                    </q-item-section>
                </q-item>

                <q-item clickable v-ripple @click="deletePicture">
                    <q-item-section class="text-center text-bold text-negative">
                        Eliminar foto actual
                    </q-item-section>
                </q-item>

                <q-item clickable v-ripple @click="showDialog = false">
                    <q-item-section class="text-center">
                        Cancelar
                    </q-item-section>
                </q-item>
            </q-list>
        </q-card>
    </q-dialog>
</template>
