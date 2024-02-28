import { useI18n } from 'vue-i18n';
import { Option } from 'src/types/UtilTypes';

export default function useEnumOptions() {
    const { t } = useI18n();

    const generateEnumOptions = (enumObject: any): Option[] => {
        const options: Option[] = [];

        // Itera sobre cada valor del enumerado y crea un objeto para cada uno
        Object.keys(enumObject).forEach((key) => {
            if (isNaN(Number(key))) {
                // Ignora las claves numéricas (propiedad __proto__ y valores del enumerado)
                const value = enumObject[key as keyof typeof enumObject]; // Obtiene el valor del enumerado
                options.push({ label: t(`shared.enum.${value}`), value }); // Agrega un objeto con la etiqueta traducida y el valor del enumerado
            }
        });

        return options;
    };

    return {
        generateEnumOptions,
    };
}
