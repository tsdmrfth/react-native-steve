module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    root: true,
    rules: {
        'comma-dangle': 'off',
        semi: [2, 'never'],
        indent: ['error', 4, { SwitchCase: 1 }],
        'no-trailing-spaces': 'error',
        'arrow-parens': 'off',
        'react/prop-types': 'off',
        'no-extra-semi': 'error',
        'react/display-name': [2, { 'ignoreTranspilerName': true }],
        'react/jsx-max-props-per-line': [1, { maximum: 1, when: 'multiline' }],
        'react/jsx-one-expression-per-line': [2, { 'allow': 'none' }],
        'react/jsx-sort-props': [
            2,
            {
                'callbacksLast': false,
                'shorthandFirst': false,
                'shorthandLast': false,
                'ignoreCase': false,
                'noSortAlphabetically': true
            }
        ],
        'react/boolean-prop-naming': [
            'error',
            {
                'propTypeNames': ['bool'],
                'rule': '^(is|has)[A-Z]([A-Za-z0-9]?)+',
                'message': 'It is better if your prop ({{ propName }}) matches this pattern: ({{ pattern }})',
                'validateNested': true
            }
        ],
        'react/default-props-match-prop-types': [2, { 'allowRequiredDefaults': true }],
        'react/jsx-curly-newline': [
            'error',
            {
                multiline: 'consistent',
                singleline: 'consistent'
            }
        ],
        'react/jsx-handler-names': [
            'error',
            {
                checkLocalVariables: true,
                checkInlineFunction: true
            }
        ],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-props-no-multi-spaces': 'error',
        'react/jsx-sort-default-props': 'error',
        'react/jsx-tag-spacing': [
            'error',
            {
                'beforeSelfClosing': 'never',
                'beforeClosing': 'never'
            }
        ],
        'react/jsx-wrap-multilines': [
            'error',
            {
                'declaration': 'parens-new-line',
                'assignment': 'parens-new-line',
                'return': 'parens-new-line',
                'arrow': 'parens-new-line',
                'condition': 'parens-new-line',
                'logical': 'parens-new-line',
                'prop': 'parens-new-line'
            }
        ],
        'react/prefer-stateless-function': 'error'
    },
    parser: 'babel-eslint',
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.d.ts', '.ts', '.tsx'],
                moduleDirectory: ['node_modules', 'src']
            }
        },
        'react': {
            'createClass': 'createReactClass',
            'pragma': 'React',
            'fragment': 'Fragment',
            'flowVersion': '0.53',
            'version': '16.13.1'
        },
        'propWrapperFunctions': [
            'forbidExtraProps',
            { 'property': 'freeze', 'object': 'Object' },
            { 'property': 'withDisplayName' }
        ],
        'linkComponents': [
            'Hyperlink',
            { 'name': 'Link', 'linkAttribute': 'to' }
        ]
    },
    'env': {
        'node': true,
        jest: true,
        es6: true
    }
}