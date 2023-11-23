import {Injectable} from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    getComicsPerPage(): number {
        const response = Number(localStorage.getItem('comicsPerPage'));
        if (!response) {
            return 3;
        }
        return response;
    }

    setComicsPerPage(comics: number) {
        localStorage.setItem('comicsPerPage', comics.toString());
    }

}
