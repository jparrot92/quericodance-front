<script setup lang="ts">
import { Ref, onMounted, watch, defineProps, ref, nextTick } from 'vue';
import { QSelect, QInput } from 'quasar';

import { countryInformation } from './types/data';
import { Country } from './types/types';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const props = withDefaults(
    defineProps<{
        modelValue?: any;
        label?: string;
        required: boolean;
    }>(),
    {
        required: false,
    }
);

const emit = defineEmits(['update:modelValue']);

const country = ref<Country | null>({
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

const search = ref<QInput>();
const countryOptions: Ref<Country[]> = ref([]);
const searchText: Ref<string> = ref('');
const phoneNumber: Ref<string> = ref('');

const validatePhoneNumber = (number: string) => {
    const phoneNumberInstance = parsePhoneNumberFromString(
        '+' + country.value?.dialCode + number
    );
    return phoneNumberInstance ? phoneNumberInstance.isValid() : false;
};

const updateModelValue = () => {
    if (country.value) {
        emit(
            'update:modelValue',
            '+' + country.value.dialCode + phoneNumber.value
        );
    } else {
        emit('update:modelValue', phoneNumber.value);
    }
};

const performSearch = () => {
    const needle = searchText.value.toLowerCase();

    if (needle === '') {
        countryOptions.value = [...countryInformation];
        return;
    }

    countryOptions.value = countryInformation.filter(
        (country: Country) =>
            country.name.toLowerCase().includes(needle) ||
            country.native?.toLowerCase().includes(needle) ||
            country.dialCode.includes(needle)
    );
};

const onShow = async () => {
    searchText.value = '';
    performSearch();
    await nextTick();
    search.value?.focus();
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
            :label="$t('shared.prefix')"
            virtual-scroll-slice-size="9999"
            @popup-show="onShow"
        >
            <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                        <span
                            :class="[
                                'v3q_tel__flag',
                                scope.opt.iso2.toLowerCase(),
                            ]"
                        ></span>
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
                        <span
                            :class="[
                                'v3q_tel__flag',
                                scope.opt.iso2.toLowerCase(),
                            ]"
                        ></span>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>{{ scope.opt.dialCode }}</q-item-label>
                    </q-item-section>
                </q-item>
            </template>
            <template v-slot:before-options>
                <q-input
                    class="sticky-input z-top q-pa-sm bg-white"
                    ref="search"
                    :label="$t('shared.search')"
                    v-model="searchText"
                    @update:model-value="performSearch"
                    dense
                    outlined
                >
                    <template v-slot:prepend>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>
            <template v-slot:no-option>
                <q-input
                    class="sticky-input z-top q-pa-sm bg-white"
                    ref="search"
                    :label="$t('shared.search')"
                    v-model="searchText"
                    @update:model-value="performSearch"
                    dense
                    outlined
                >
                    <template v-slot:prepend>
                        <q-icon name="search" />
                    </template>
                </q-input>
                <div class="q-pa-sm">{{ $t('shared.noResults') }}</div>
            </template>
        </q-select>
        <q-input
            class="col-8 q-pl-md q-pl-sm"
            :label="props.label"
            v-model="phoneNumber"
            :rules="[
                (val: string) => {
                if (props.required && val.length === 0) {
                    return $t('shared.validations.required');
                }
                if (val.length > 0 && !validatePhoneNumber(val)) {
                    return $t('shared.validations.formatPhoneNumber');
                }
                return true;
                }
            ]"
        />
    </div>
</template>
