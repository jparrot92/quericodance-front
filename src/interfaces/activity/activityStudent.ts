import { StudentDTO } from 'src/interfaces/student/student';
import { ActivityDTO } from './activity';

export interface ActivityStudentDTO {
    id: number;
    danceRole: string;
    price: number;
    activity: ActivityDTO;
    student?: StudentDTO;
}
