import * as csstree from 'css-tree';
import Color from 'color';
import { variablePrefix, propertiesWithColors, colorRegex, colorRegexG } from './consts.js';
import { changeChildren, removeChildren, declarationValueString, formatCSS, modelToCSS } from './functions.js';

export default function (rawCSS, {beautify, astHandler, allHex, allRGB, darkify, hslOrder, comments}) {
    if(beautify === undefined) beautify = true;

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
    const newColors = [];
    for (const color in colorVariables) {
        if (Object.hasOwnProperty.call(colorVariables, color)) {
            const index = colorVariables[color];
            let colorString = color;
            let realColor = new Color(colorString);
            let comment = [realColor.keyword()];
            let modded = false;
            if(realColor.isDark()) {
                comment.push('dark');
            }
            if(realColor.isLight()) {
                comment.push('light');
            }
            if(realColor.hue() === 0 && realColor.saturationl() === 0) {
                comment.push('monochrome');
                if(darkify) {
                    modded = true;
                    realColor = realColor.negate();
                    colorString = realColor.hexa();
                }
                if(realColor.red() > 0 && realColor.red() < 255) {
                    comment.push('grays');
                }
            }
            if(modded) {
                comment.push('modified');
            }
            if(allHex) colorString = realColor.hexa();
            if(allRGB) colorString = realColor.rgb().string();
            newColors.push(realColor);
            newColorVariables.push(`${variablePrefix}${index}: ${colorString} !important;${comments ? ` /*! ${comment.join(' ')} */` : ''}`);
        }
    }
    newColorVariables.sort((a, b) => {
        if(hslOrder) {
            let ac = newColors[newColorVariables.indexOf(a)];
            let bc = newColors[newColorVariables.indexOf(b)];
            return `${ac.hue()}_${ac.saturationl()}_${ac.lightness()}`.localeCompare(`${bc.hue()}_${bc.saturationl()}_${bc.lightness()}`);
        }
        a = Number(a.replace(variablePrefix, ''));
        b = Number(b.replace(variablePrefix, ''));
        return a - b;
    });
    newCSS = `:root{${newColorVariables.join('')}}` + newCSS;

    // Clean Up
    let cleanCSS = formatCSS(newCSS, beautify);
    if(comments) {
        cleanCSS = cleanCSS.replace("!important/*!", " !important; /*!");
        cleanCSS = cleanCSS.replace(/;(\s*)\//g, "; /");
    }

    const newAST = {...model};
    
    if(astHandler) {
        astHandler(oldAST, newAST);
    }

    return cleanCSS;
}