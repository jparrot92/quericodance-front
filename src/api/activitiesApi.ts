import { api } from 'boot/axios';
import { Activity } from 'src/modules/activities/models/activity';
import { handleError } from './errorApi';

api.defaults.headers.common['Authorization'] =
    'Bearer ' + localStorage.getItem('token');

export const listActivities = async (): Promise<Activity[]> => {
    try {
        const { data } = await api.get<Activity[]>('/activities');

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getActivity = async (id: string): Promise<Activity> => {
    try {
        const { data } = await api.get<Activity>(`/activities/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createActivity = async (activity: Activity): Promise<Activity> => {
    try {
        const { data } = await api.post<Activity>('/activities', activity);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateActivity = async (
    id: string,
    activity: Activity
): Promise<Activity> => {
    try {
        const { data } = await api.put<Activity>(`/activities/${id}`, activity);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteActivity = async (id: string): Promise<Activity> => {
    try {
        const { data } = await api.delete<Activity>(`/activities/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
