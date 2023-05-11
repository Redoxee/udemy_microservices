import {faker} from '@faker-js/faker';
import { Mappable } from './CustomMap';

export class Company implements Mappable{
    companyName: string;
    catchPhrase: string;
    location: {
        lat: number,
        lng: number,
    }

    constructor() {
        this.companyName = faker.company.name();
        this.catchPhrase = faker.company.catchPhrase();
        this.location = {
            lat: parseFloat(faker.address.latitude()),
            lng: parseFloat(faker.address.longitude()),
        }
    }

    markerContent(): string {
        return `<h1>Company ${this.companyName}</h1>
        <h2>${this.catchPhrase}</h2>`;
    }
}