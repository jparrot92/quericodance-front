import { ActivityViewDTO } from 'src/modules/activities/models/activity';

export interface MembershipActivityDTO {
    membershipId: number;
    activityId: number;
    danceRole: string;
}

export interface MembershipActivityViewDTO {
    id: number;
    danceRole: string;
    activity: ActivityViewDTO;
}
