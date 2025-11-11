import { SignupDto } from "src/auth/auth.dto";
import { KeyclockService } from "../keyclock.service";
import { UserKeyclock } from "./user";
import { User } from "src/user/user.model";


export class UserKeyClockAdapter {

    constructor() {}

    // signupAdapter(user: User) {
    //     const userKeyclock = new UserKeyclock(user.email, [
    //         {
    //             type: 'password',
    //             value: user.password,
    //             temporary: false,
    //         }
    //     ]);

    //     return userKeyclock.getUserKeyclock();
    // }
}