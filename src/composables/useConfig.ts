import { reactive } from 'vue';

const useConfig = () => {
    const config = reactive({
        studentAcces: false,
    });

    return {
        config,
    };
};

export default useConfig;
