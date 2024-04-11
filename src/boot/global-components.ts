import { boot } from 'quasar/wrappers';
import PdSelect from 'src/components/Select/PdSelect.vue';

export default boot(({ app }) => {
    app.component('pd-select', PdSelect);
});
