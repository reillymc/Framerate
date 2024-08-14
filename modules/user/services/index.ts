import { getUser } from "./getUser";
import { getUsers } from "./getUsers";
import { saveUser } from "./saveUser";

export const UsersService = {
    getUser,
    saveUser,
    getUsers,
};

export { UserDetails } from "./getUser";
export { SaveUserParams } from "./saveUser";
export { UserSummary } from "./getUsers";
