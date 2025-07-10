export class UserDTO {
    constructor(
        readonly login: string,
        readonly password:string,
        readonly email:string) {
    }
}