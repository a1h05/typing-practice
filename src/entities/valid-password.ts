import * as t from "runtypes";

export const ValidPassword = t.String
    .withBrand('ValidPassword')
    .withConstraint(str => str.length >= 4 || 'Invalid password');
export type ValidPassword = t.Static<typeof ValidPassword>
