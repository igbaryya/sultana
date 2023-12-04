import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginImport from 'eslint-plugin-import';
import typescriptEslintParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';

export default [
    {
        ignores: ["node_modules/", "dist/"]
    },
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parser: typescriptEslintParser,
            parserOptions: {
                project: './tsconfig.json',
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        plugins: {
            react: eslintPluginReact,
            jsxA11y: eslintPluginJsxA11y,
            import: eslintPluginImport,
            "@typescript-eslint": typescriptEslintPlugin
        },
        settings: {
            react: {
                version: "detect"
            }
        },
        rules: {
            "no-unused-vars": ["off"],
            "no-underscore-dangle": ["off"],
            "no-param-reassign": ["error", { "props": true, "ignorePropertyModificationsFor": ["draft"] }],
            "max-lines-per-function": ["error", 150],
            "max-lines": ["error", { "max": 350 }],
            "max-depth": "error",
            "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1 }],
            "react/sort-comp": ["off"],
            "jsx-a11y/anchor-is-valid": ["off"],
            "react/display-name": ["off"],
            "react/prefer-stateless-function": ["off"],
            "import/no-named-as-default": ["off"],
            "arrow-body-style": ["off"],
            "import/order": ["off"],
            "func-names": ["off"],
            "guard-for-in": ["off"],
            "lines-between-class-members": ["off"],
            "jsx-a11y/label-has-associated-control": ["off"],
            "import/prefer-default-export": ["off"],
            "import/no-default-export": ["off"],
            "react/jsx-one-expression-per-line": ["off"],
            "class-methods-use-this": ["off"],
            "max-len": ["error", { "code": 220 }],
            "no-trailing-spaces": ["error", { "skipBlankLines": true, "ignoreComments": true }],
            "react/jsx-props-no-spreading": ["off"],
            "linebreak-style": 0,
            "global-require": 0,
            "eslint-linebreak-style": [0, "error", "windows"],
            "indent": ["error", 4, { "SwitchCase": 1 }],
            "no-tabs": ["error", { "allowIndentationTabs": true }],
            "react/jsx-indent-props": ["error", 4],
            "react/jsx-indent": ["error", 4],
            "comma-dangle": ["error", "only-multiline"],
            "no-console": 1,
            "semi": ["error", "always"],
            "@typescript-eslint/no-unused-vars": ["error"],
            "@typescript-eslint/explicit-function-return-type": ["off"],
            "@typescript-eslint/no-use-before-define": ["off"],
            "@typescript-eslint/no-explicit-any": ["off"],
            "@typescript-eslint/indent": ["error", 4]
        }
    }
];