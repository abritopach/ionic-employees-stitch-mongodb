import { ObjectId } from 'bson';
import { HolidayDetail } from './holiday.detail.model';

export interface RequestHolidays {
    id: ObjectId;
    userId: ObjectId;
    holidaysDetail: HolidayDetail;
}
