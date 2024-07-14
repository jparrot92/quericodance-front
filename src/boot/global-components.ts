import { boot } from 'quasar/wrappers';
import PdSelect from 'src/components/Select/PdSelect.vue';
import PdEditor from 'src/components/Editor/PdEditor.vue';
import PdField from 'src/components/Field/PdField.vue';
import PdFilter from 'src/components/Filter/PdFilter.vue';

export default boot(({ app }) => {
    app.component('pd-select', PdSelect);
    app.component('pd-editor', PdEditor);
    app.component('pd-field', PdField);
    app.component('pd-filter', PdFilter);
});
