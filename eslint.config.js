import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const LAYERS = ['shared', 'entities', 'features', 'widgets', 'pages', 'app'];

const publicApiPattern = {
  group: ['src/entities/*/*', 'src/features/*/*', 'src/widgets/*/*', 'src/pages/*/*'],
  message: 'FSD: import slices through their public API (index.ts).',
};

const fsdLayerConfigs = LAYERS.map((layer, index) => {
  const upperLayers = LAYERS.slice(index + 1);
  const patterns = [publicApiPattern];
  if (upperLayers.length > 0) {
    patterns.unshift({
      group: upperLayers.map((upper) => `src/${upper}`).flatMap((path) => [path, `${path}/**`]),
      message: `FSD: "${layer}" must not import from upper layers (${upperLayers.join(', ')}).`,
    });
  }
  return {
    files: [`src/${layer}/**/*.{ts,tsx}`],
    rules: { 'no-restricted-imports': ['error', { patterns }] },
  };
});

export default defineConfig(
  globalIgnores(['dist', 'public', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.strict, reactHooks.configs.flat.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  ...fsdLayerConfigs,
);
