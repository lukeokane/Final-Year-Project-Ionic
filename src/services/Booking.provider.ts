import { Booking } from './../class/Booking';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Api } from '../providers/api/api';
import { createRequestOption } from './../providers/request-util';

@Injectable()
export class BookingsService {
    private resourceUrl = Api.API_URL + '/bookings';

    constructor(private http: HttpClient) { }

    create(booking: Booking): Observable<Booking> {
        return this.http.post(this.resourceUrl, booking);
    }

    update(booking: Booking): Observable<Booking> {
        return this.http.put(this.resourceUrl, booking);
    }

    find(id: number): Observable<Booking> {
        return this.http.get(`${this.resourceUrl}/${id}`);
    }

    query(req?: any): Observable<any> {
        return this.http.get(this.resourceUrl);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response', responseType: 'text' });
    }

    findBookingsPendingAdminApproval(req?: any): Observable<HttpResponse<Booking[]>> {
        const options = createRequestOption(req);
        return this.http.get<Booking[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Booking[]>) => this.convertArrayResponse(res));
    }

    findUserBookings(userId : number,req): Observable<any> {
        const options = createRequestOption(req);
        return this.http.get(`${this.resourceUrl}/userId /${userId }`,{ params: options, observe: 'response' }) .map((res: HttpResponse<Booking[]>) => this.convertArrayResponse(res));
    }

    
    private convertArrayResponse(res: HttpResponse<Booking[]>): HttpResponse<Booking[]> {
        const jsonResponse: Booking[] = res.body;
        const body: Booking[] = [];
        if (jsonResponse != undefined && jsonResponse != null) {
            for (let i = 0; i < jsonResponse.length; i++) {
                body.push(this.convertItemFromServer(jsonResponse[i]));
            }
        }
        return res.clone({ body });
    }

    /**
* Convert a returned JSON object to Semester.
*/
    private convertItemFromServer(object: Booking): Booking {
        const copy: Booking = Object.assign({}, object);
        return copy;
    }

}