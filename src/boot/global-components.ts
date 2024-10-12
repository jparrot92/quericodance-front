import { boot } from 'quasar/wrappers';
import PdSelect from 'src/components/Select/PdSelect.vue';
import PdEditor from 'src/components/Editor/PdEditor.vue';
import PdField from 'src/components/Field/PdField.vue';
import PdFilter from 'src/components/Filter/PdFilter.vue';
import PdPhoneInput from 'src/components/PhoneInput/PdPhoneInput.vue';
import PdDate from 'src/components/Date/PdDate.vue';
import PdMenuList from 'src/components/MenuList/PdMenuList.vue';

export default boot(({ app }) => {
    app.component('pd-select', PdSelect);
    app.component('pd-editor', PdEditor);
    app.component('pd-field', PdField);
    app.component('pd-filter', PdFilter);
    app.component('pd-phone-input', PdPhoneInput);
    app.component('pd-date', PdDate);
    app.component('pd-menu-list', PdMenuList);
});
