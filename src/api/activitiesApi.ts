import { api } from 'boot/axios';
import {
    ActivityDTO,
    ActivityCounters,
} from 'src/modules/activities/models/activity';
import { handleError } from './errorApi';
import { ActivityStudent } from 'src/modules/activities/models/activityStudent';

api.defaults.headers.common['Authorization'] =
    'Bearer ' + localStorage.getItem('token');

export const listActivities = async (): Promise<ActivityDTO[]> => {
    try {
        const { data } = await api.get<ActivityDTO[]>('/activities');

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getCountersActivity = async (
    id: number
): Promise<ActivityCounters> => {
    try {
        const { data } = await api.get<ActivityCounters>(
            `/activities/${id}/counters`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getActivity = async (id: string): Promise<ActivityDTO> => {
    try {
        const { data } = await api.get<ActivityDTO>(`/activities/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createActivity = async (
    activity: ActivityDTO
): Promise<ActivityDTO> => {
    try {
        const { data } = await api.post<ActivityDTO>('/activities', activity);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateActivity = async (
    id: string,
    activity: ActivityDTO
): Promise<ActivityDTO> => {
    try {
        const { data } = await api.put<ActivityDTO>(
            `/activities/${id}`,
            activity
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteActivity = async (id: number): Promise<ActivityDTO> => {
    try {
        const { data } = await api.delete<ActivityDTO>(`/activities/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createActivityStudent = async (
    studentId: number,
    activityId: number,
    danceRole: string,
    price: number
): Promise<ActivityStudent[]> => {
    try {
        const requestData = {
            studentId,
            activityId,
            danceRole,
            price,
        };

        const { data } = await api.post<ActivityStudent[]>(
            '/activity-student',
            requestData
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteActivityStudent = async (
    id: number
): Promise<ActivityStudent[]> => {
    try {
        const { data } = await api.delete<ActivityStudent[]>(
            `/activity-student/${id}`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
