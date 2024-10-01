// Función para convertir la fecha a formato YYYY-MM-DD
function formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// Función para convertir la fecha a formato DD/MM/YYYY
function convertDateToDDMMYYYY(date: string): string {
    const isoDate = new Date(date);
    const day = isoDate.getDate();
    const month = isoDate.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que debemos sumar 1
    const year = isoDate.getFullYear();

    return `${day.toString().padStart(2, '0')}/${month
        .toString()
        .padStart(2, '0')}/${year}`;
}

const getPeriodDates = (period: string): { startDate: Date; endDate: Date } => {
    // Separar el periodo usando "/" para obtener el mes y el año
    const [month, year] = period.split('/').map(Number); // Convertimos a números

    // Comprobar si los valores son válidos
    if (!month || !year || month < 1 || month > 12) {
        throw new Error('Periodo inválido. Debe estar en formato MM/YYYY.');
    }

    // Crear las fechas de inicio y fin del mes
    const startDate = new Date(year, month - 1, 1); // Primer día del mes
    const endDate = new Date(year, month, 0); // Último día del mes

    return { startDate, endDate };
};

const formatDateToString = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0'); // Obtenemos el día y lo formateamos a 2 dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtenemos el mes y lo formateamos a 2 dígitos (meses en JS van de 0 a 11)
    const year = date.getFullYear(); // Obtenemos el año

    return `${day}/${month}/${year}`; // Retornamos el formato DD/MM/YYYY
};

function convertToYearMonth(dateString: string): string {
    const [month, year] = dateString.split('/');
    return `${year}-${month}`;
}

export default function useDates() {
    return {
        formatDateToYYYYMMDD,
        convertDateToDDMMYYYY,
        getPeriodDates,
        formatDateToString,
        convertToYearMonth,
    };
}
