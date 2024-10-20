import { axiosPrivate } from './AxiosClient';

export class AppointmentAPI {

    static async getAppointmentBySenderId() {
        const url = `/appointment`;
        return axiosPrivate.get(url);
    }
}