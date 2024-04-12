export interface Pass {
    id: number;
    name: string;
    sessions: number | null;
    sessionFrequency: string;
    paymentFrequency: string;
    price: number | null;
    description: string;
}
