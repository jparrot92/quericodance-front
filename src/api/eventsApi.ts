import { api } from 'boot/axios';
import { handleError } from './errorApi';
import { EventDTO } from 'src/model/activity.model';

const eventsEndpoint = '/events';

export default {
    getEvents: async (): Promise<EventDTO[]> => {
        try {
            const { data } = await api.get<EventDTO[]>(eventsEndpoint);
            return data;
        } catch (error) {
            throw handleError(error);
        }
    },

    getEvent: async (id: string): Promise<EventDTO> => {
        try {
            const { data } = await api.get<EventDTO>(`${eventsEndpoint}/${id}`);
            return data;
        } catch (error) {
            throw handleError(error);
        }
    },

    createEvent: async (event: EventDTO): Promise<EventDTO> => {
        try {
            const { data } = await api.post<EventDTO>(eventsEndpoint, event);
            return data;
        } catch (error) {
            throw handleError(error);
        }
    },

    updateEvent: async (id: string, event: EventDTO): Promise<EventDTO> => {
        try {
            const { data } = await api.put<EventDTO>(
                `${eventsEndpoint}/${id}`,
                event
            );
            return data;
        } catch (error) {
            throw handleError(error);
        }
    },

    deleteEvent: async (id: number): Promise<EventDTO> => {
        try {
            const { data } = await api.delete<EventDTO>(
                `${eventsEndpoint}/${id}`
            );
            return data;
        } catch (error) {
            throw handleError(error);
        }
    },
};
