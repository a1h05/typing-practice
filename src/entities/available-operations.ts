import {Role} from "./role";
import {Operation} from "./operation";

export const AVAILABLE_OPERATIONS = {
    [Role.CLIENT]: {
        [Role.ADMIN]: [],
        [Role.MODERATOR]: [],
        [Role.CLIENT]: []
    },
    [Role.MODERATOR]: {
        [Role.MODERATOR]: [Operation.UPDATE_TO_CLIENT],
        [Role.CLIENT]: [Operation.UPDATE_TO_MODERATOR],
        [Role.ADMIN]: [],
    },
    [Role.ADMIN]: {
        [Role.ADMIN]: [Operation.UPDATE_TO_CLIENT, Operation.UPDATE_TO_MODERATOR],
        [Role.CLIENT]: [Operation.UPDATE_TO_ADMIN, Operation.UPDATE_TO_MODERATOR],
        [Role.MODERATOR]: [Operation.UPDATE_TO_ADMIN, Operation.UPDATE_TO_CLIENT],
    }
} as const;

export type AVAILABLE_OPERATIONS_TYPE = typeof AVAILABLE_OPERATIONS
