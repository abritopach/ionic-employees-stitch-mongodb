import { ObjectId } from 'bson';

export interface HolidayDetail {
    id: ObjectId;
    type: string;
    whoFor: string;
    startDate: string;
    endDate: string;
    reason: string;
}
