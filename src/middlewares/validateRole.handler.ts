import jwtAuthz from 'express-jwt-authz';

type Role = 'admin' | 'reader' | 'editor';

const validateRole = (roles: Role[]) => jwtAuthz(roles, { customScopeKey: 'role' });

export default validateRole;
