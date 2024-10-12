<template>
    <q-btn size="12px" flat dense round icon="more_vert" @click.stop>
        <q-menu>
            <q-list style="width: 200px">
                <slot></slot>
            </q-list>
        </q-menu>
    </q-btn>
</template>
<style lang="sass">
.my-sticky-last-column-table
  thead tr:last-child th:last-child
    /* bg color is important for th; just specify one */
    background-color: white

  td:last-child
    background-color: white

  th:last-child,
  td:last-child
    position: sticky
    right: 0
    z-index: 1
</style>
