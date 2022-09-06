export const variablePrefix = '--nerdy-css-themer-color-';

export const propertiesWithColors = [
    'color',
    'background',
    'background-color',
    'background-image',
    'border',
    'border-top',
    'border-right',
    'border-bottom',
    'border-left',
    'border-color',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'outline',
    'outline-color',
    'text-shadow',
    'box-shadow',
    'fill'
];

export const colorRegex = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/i;
export const colorRegexG = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi;

export const minificationOptions = {
    level: 1,
    compatibility: {
        colors: {
            hexAlpha: true,
            opacity: true,
        },
        properties: {
            colors: false,
            zeroUnits: false,
        },
    }
};