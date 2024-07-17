<script setup lang="ts">
import { Ref, onMounted, watch } from 'vue';
import { computed, defineProps, ref } from 'vue';
import { countryInformation } from './types/data';
import { Country } from './types/types';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const props = withDefaults(
    defineProps<{
        modelValue?: any;
        label?: string;
    }>(),
    {}
);

const emit = defineEmits(['update:modelValue']);

const country = ref<Country>({
    iso2: 'ES',
    name: 'Spain',
    native: 'España',
    dialCode: '34',
    continent_name: 'EU',
    capital: 'Madrid',
    currency: 'EUR',
    languages: ['es', 'eu', 'ca', 'gl', 'oc'],
    emoji: '🇪🇸',
    emojiU: 'U+1F1EA U+1F1F8',
});

const countryOptions: Ref<Country[]> = ref([]);
const phoneNumber = ref('');

const validatePhoneNumber = (number: string) => {
    const phoneNumberInstance = parsePhoneNumberFromString(
        '+' + country.value.dialCode + number
    );
    return phoneNumberInstance ? phoneNumberInstance.isValid() : false;
};

const updateModelValue = () => {
    emit('update:modelValue', '+' + country.value.dialCode + phoneNumber.value);
};

onMounted(() => {
    countryOptions.value = [...countryInformation];
    if (props.modelValue) {
        const foundCountry = countryOptions.value.find((c: Country) =>
            props.modelValue.startsWith('+' + c.dialCode)
        );
        if (foundCountry) {
            country.value = foundCountry;
            phoneNumber.value = props.modelValue.replace(
                '+' + foundCountry.dialCode,
                ''
            );
        }
    }
});

watch([country, phoneNumber], updateModelValue);
</script>

<template>
    <div class="row">
        <q-select
            class="col-4"
            v-model="country"
            :options="countryOptions"
            label="Codigo pais:"
            clearable
            options-selected-class="text-deep-orange"
        >
            <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                        <span class="flag-emoji">{{ scope.opt.emoji }}</span>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>{{ scope.opt.dialCode }}</q-item-label>
                        <q-item-label caption>{{
                            scope.opt.native
                        }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-separator />
            </template>
            <template v-slot:selected-item="scope">
                <q-item
                    class="q-pa-none ellipsis"
                    v-if="scope.opt"
                    style="min-height: unset"
                >
                    <q-item-section avatar>
                        <span class="flag-emoji">{{ scope.opt.emoji }}</span>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>{{ scope.opt.dialCode }}</q-item-label>
                    </q-item-section>
                </q-item>
            </template>
        </q-select>
        <q-input
            class="col-8 q-pl-md q-pl-sm"
            :label="props.label"
            v-model="phoneNumber"
            :rules="[
                (val: string) => val.length > 0 || 'Phone number is required',
                (val: string) => validatePhoneNumber(val) || 'Invalid phone number'
            ]"
        />
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');

.flag-emoji {
    font-family: 'Noto Color Emoji', sans-serif;
    font-size: 1.5em;
}
</style>
