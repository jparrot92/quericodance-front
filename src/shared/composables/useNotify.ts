import { useQuasar } from 'quasar';
export default function useNotify() {
    const $q = useQuasar();

    const notifySuccess = (message: string) => {
        $q.notify({
            type: 'positive',
            message: message || 'All right !'
        });
    };

    const notifyError = (error: unknown) => {
        if (typeof error === 'string') {
            $q.notify({
                type: 'negative',
                message: error || 'Failed !'
            });
        } else if (error && typeof error === 'object' && 'message' in error) {
            $q.notify({
                type: 'negative',
                message: String(error.message) || 'Failed !'
            });
        } else {
            console.error('Unknown error: ' + error);
        }
    };

    return {
        notifySuccess,
        notifyError
    };
}
