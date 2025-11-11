import { Observable } from "rxjs";
import { User } from "src/user/interface/user.interface";

export interface KeyclockAction {
    getAdminToken(): Observable<string>;
    login(email: string, password: string): Observable<string>;
    // createUser(user: any, token: string): Observable<any>;
    updateUser(user: User): Observable<string>;
    deleteUser(user: User): Observable<string>
    
}