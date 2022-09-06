import CleanCSS from 'clean-css';
import * as csstree from 'css-tree';
import { minificationOptions } from './consts.js';

export function changeChildren(parentNode, predicate, action, recursive = true) {
    const children = getChildren(parentNode);
    if(children && children.length) {
        let i = children.length
        while (i--) {
            if (predicate(children[i])) {
                action(children[i], i, children);
            } else if (recursive) {
                changeChildren(children[i], predicate, action, recursive);
            }
        }
    }
    return parentNode;
}

export function removeChildren(parentNode, predicate, recursive = true) {
    return changeChildren(parentNode, predicate, (_, index, allChildren) => {
        allChildren.splice(index, 1);
    }, recursive);
}

export function getChildren(parentNode) {
    if(parentNode.children !== undefined) return parentNode.children;
    if(parentNode.block !== undefined) return parentNode.block.children;
    return [];
}

export function declarationValueString(node) {
    return csstree.generate(csstree.fromPlainObject(node.value));
}

export function formatCSS(css, beautify = true) {
    return new CleanCSS({
        ...minificationOptions,
        format: beautify ? 'beautify' : undefined,
    }).minify(css).styles;
}

export function modelToCSS(model, beautify = false) {
    return new CleanCSS({
        ...minificationOptions,
        format: beautify ? 'beautify' : undefined,
    }).minify(csstree.generate(csstree.fromPlainObject({...model}))).styles;
}