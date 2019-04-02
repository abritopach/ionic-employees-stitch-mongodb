import { ObjectId } from 'bson';
import { HolidayDetail } from './holiday.detail.model';

export interface Holiday {
    total: number | 22;
    not_taken: number | 22;
    taken: {
        days: number;
        info: HolidayDetail[]
    };
}
