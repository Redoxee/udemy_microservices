export interface Mappable {
    location: {
        lat: number,
        lng: number
    };

    markerContent(): string;
}

export class CustomMap {
    private googleMap: google.maps.Map;
    constructor(rootId : string) {
        const mapEl = document.getElementById(rootId);
        if(!mapEl)
        {
            throw(`Could not find root map element with id ${rootId}`);
        }

        new google.maps.Map(mapEl, {
            zoom: 1,
            center: {lat: 0, lng: 0}
        });
    }

    public AddMarker(mappable: Mappable) : void
    {
        const marker = new google.maps.Marker({
            map: this.googleMap,
            position: {
                lat: mappable.location.lat,
                lng: mappable.location.lng,
            }
        });

        marker.addListener('click', ()=> {
            const infoWindow = new google.maps.InfoWindow({
                content: mappable.markerContent()
            });

            infoWindow.open(this.googleMap, marker);
        })
    }
}