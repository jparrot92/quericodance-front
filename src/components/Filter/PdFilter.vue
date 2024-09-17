<script setup lang="ts">
import { computed, ref } from 'vue';
import { FilterField } from '../../composables/useFilterTypes';
import { defineProps, withDefaults } from 'vue';

// Definir las propiedades con valores predeterminados
const props = withDefaults(
    defineProps<{
        modelValue?: object & { query: string };
        filters?: Array<FilterField>;
        placeholder: string;
    }>(),
    {
        filters: () => [],
        placeholder: '',
    }
);

const emit = defineEmits(['update:modelValue']);

const model = computed({
    get: () => props.modelValue,
    set: (value: string) => {
        emit('update:modelValue', value);
    },
});

const showFilters = ref<boolean>(false);
const numSelectFilters = ref<number>(0);

const toggleShowFilters = () => {
    showFilters.value = !showFilters.value;
};

const resetModelValue = () => {
    props.filters.forEach((filter: FilterField) => {
        model.value[filter.field] = null;
    });
};

const countNonNullValues = (): number => {
    // Excluir el campo 'query' del conteo
    return Object.keys(model.value)
        .filter(
            (key) =>
                key !== 'id' &&
                key !== 'child' &&
                key !== 'query' &&
                key !== 'pagination'
        )
        .map((key) => model.value[key])
        .filter((value) => value !== null).length;
};

const resetFilters = () => {
    numSelectFilters.value = 0;
    resetModelValue();
};

const search = () => {
    numSelectFilters.value = countNonNullValues();
    console.info('Search');
};
</script>

<template>
    <q-input
        v-model="model.query"
        rounded
        outlined
        dense
        debounce="300"
        :placeholder="props.placeholder"
    >
        <template v-slot:prepend>
            <q-icon name="mdi-magnify" />
        </template>
        <template v-slot:append>
            <q-btn dense round flat icon="mdi-tune" @click="toggleShowFilters">
                <q-badge color="red" floating transparent>
                    {{ countNonNullValues() }}
                </q-badge>
            </q-btn>
        </template>
    </q-input>
    <div class="col-12" v-if="showFilters">
        <div class="row">
            <div
                class="col-12 col-md-3"
                v-for="f in filters"
                :key="`input-${f.field}`"
            >
                <pd-select
                    class="q-ml-sm"
                    v-model="model[f.field]"
                    :label="f.label"
                    :options="f.options"
                >
                    <template v-slot:append>
                        <q-icon
                            class="cursor-pointer"
                            name="clear"
                            @click.stop.prevent="model[f.field] = null"
                        />
                    </template>
                </pd-select>
            </div>
        </div>

        <!--<q-btn
            class="full-width"
            outline
            rounded
            color="primary"
            label="Restablecer"
            @click="resetFilters"
        />
        <q-btn
            class="full-width"
            unelevated
            rounded
            color="primary"
            label="Buscar"
            @click="search"
        />-->
    </div>
</template>
