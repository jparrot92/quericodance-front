import { boot } from 'quasar/wrappers';
import PdSelect from 'src/components/Select/PdSelect.vue';
import PdEditor from 'src/components/Editor/PdEditor.vue';

export default boot(({ app }) => {
    app.component('pd-select', PdSelect);
    app.component('pd-editor', PdEditor);
});
