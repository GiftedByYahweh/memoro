import config from '../../eslint.config.ts';

export default [{ ignores: ['dist', 'db/migrations'] }, ...config];
