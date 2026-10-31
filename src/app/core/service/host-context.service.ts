import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const STORAGE_KEY = 'nautilus_active_host_id';

@Injectable({
    providedIn: 'root',
})
export class HostContextService {
    private activeHostIdSubject = new BehaviorSubject<string | null>(this.readStoredHostId());
    activeHostId$: Observable<string | null> = this.activeHostIdSubject.asObservable();

    get activeHostId(): string | null {
        return this.activeHostIdSubject.value;
    }

    setActiveHost(hostId: string | null): void {
        this.activeHostIdSubject.next(hostId);
        try {
            if (hostId) {
                localStorage.setItem(STORAGE_KEY, hostId);
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch {
            // localStorage indisponivel (ex.: navegacao privada) - segue sem persistir
        }
    }

    private readStoredHostId(): string | null {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch {
            return null;
        }
    }
}
