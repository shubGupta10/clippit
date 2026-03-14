import { userService } from "../user/user.service";
import { IUser } from "../user/user.interface";

const handleUserCreated = async (data: IUser) => {
    await userService.createUser(data);
};

export const authService = {
    handleUserCreated,
};