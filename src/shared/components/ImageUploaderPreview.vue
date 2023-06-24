<template>
    <div>
        <input
            type="file"
            ref="fileInput"
            accept="image/*"
            @change="handleImageChange"
        />
        <q-avatar size="200px">
            <q-img :src="selectedImage" no-native-menu>
                <q-btn
                    class="absolute all-pointer-events"
                    round
                    color="primary"
                    icon="shopping_cart"
                    style="top: 8px; left: 140px"
                    @click="choosePicture"
                >
                    <q-tooltip>Seleccionar foto de perfil</q-tooltip>
                </q-btn>
            </q-img>
        </q-avatar>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedImage = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const handleImageChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
            selectedImage.value = reader.result as string;
        };
        reader.readAsDataURL(file);
    }
};

const choosePicture = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};
</script>
