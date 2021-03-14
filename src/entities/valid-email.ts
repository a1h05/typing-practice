import * as t from "runtypes";

export const ValidEmail = t.String
    .withBrand('ValidEmail')
    .withConstraint(str => (/^[^\s@]+@[^\s@]+$/).test(str) || 'Invalid email');
export type ValidEmail = t.Static<typeof ValidEmail>
