export interface TariffDTO {
    id: number;
    name: string;
    sessions: number | null;
    sessionFrequency: string;
    paymentFrequency: string;
    price: number | null;
    description: string;
}
