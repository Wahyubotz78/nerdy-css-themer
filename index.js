import * as csstree from 'css-tree';
import { variablePrefix, propertiesWithColors, colorRegex, colorRegexG } from './consts.js';
import { changeChildren, removeChildren, declarationValueString, formatCSS, modelToCSS } from './functions.js';

export default function (rawCSS, {beautify, astHandler}) {
    rawCSS = formatCSS(rawCSS, false);
    let model = csstree.toPlainObject(csstree.parse(rawCSS));
    const oldAST = {...model};

    // Remove declarations that can't have color
    model = removeChildren(model, node => node.type === 'Declaration' && !propertiesWithColors.includes(node.property));

    // Remove declarations which do not contain colors in value
    model = removeChildren(model, node => {
        if(node.type === 'Declaration') {
            const valueString = declarationValueString(node);
            if(!colorRegex.test(valueString)) {
                return true;
                
            }
        }
        return false;
    });

    // Extract and replace colors with variables
    const colorVariables = {};
    let colorVariableIndex = 0;
    model = changeChildren(model, node => {
        if(node.type === 'Declaration') {
            const valueString = declarationValueString(node);
            if(colorRegex.test(valueString)) {
                return true;
            }
        }
        return false;
    }, node => {
        let valueString = declarationValueString(node);
        const replacer = function(match, contents, offset, input_string)
        {
            if(colorVariables[contents] === undefined) {
                colorVariableIndex++;
                colorVariables[contents] = colorVariableIndex;
            }
            const index = colorVariables[contents];
            return `var(${variablePrefix}${index})`;
        };
        valueString = valueString.replace(colorRegex, replacer);
        valueString = valueString.replace(colorRegexG, replacer);
        const valueObject = csstree.toPlainObject(csstree.parse(valueString));
        node.value = valueObject;
    });

    // Importantize
    model = changeChildren(model, node => node.type === 'Declaration', (node) => node.important = true);

    // Remove Comments
    model = removeChildren(model, node => node.type === 'Comment');

    // Create CSS
    let newCSS = modelToCSS({...model});

    // Color Variables
    const newColorVariables = [];
    for (const color in colorVariables) {
        if (Object.hasOwnProperty.call(colorVariables, color)) {
            const index = colorVariables[color];
            newColorVariables.push(`${variablePrefix}${index}: ${color} !important;`);
        }
    }
    newColorVariables.sort((a, b) => {
        a = Number(a.replace(variablePrefix, ''));
        b = Number(b.replace(variablePrefix, ''));
        return a - b;
    });
    newCSS = `:root{${newColorVariables.join('')}}` + newCSS;

    // Clean Up
    const cleanCSS = formatCSS(newCSS, beautify);

    const newAST = {...model};
    
    if(astHandler) {
        astHandler(oldAST, newAST);
    }

    return cleanCSS;
}