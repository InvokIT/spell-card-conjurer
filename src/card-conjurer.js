const DOMParser = require("xmldom").DOMParser;
const xpath = require("xpath");
const vm = require("vm");

const textTransmuter = (cardCtx, cardSvg) => {
    xpath.select("[transmute-text]", cardSvg).forEach(node => {
        const cardValueCode = node.getAttribute("transmute-text");
        const cardValue = vm.runInContext(cardValueCode, cardCtx);
        const textNode = node.firstChild;
        textNode.replaceData(0, node.length, cardValue);
    });

    return cardSvg;
}

const attributeTransmuter = (cardCtx, cardSvg) => {
    xpath.select("[transmute-attr:name]", cardSvg).forEach(node => {
        const attrName = node.getAttribute("transmute-attr:name");
        const cardValueCode = node.getAttribute("transmute-attr:value");
        const cardValue = vm.runInContext(cardValueCode, cardCtx);
        node.setAttribute(attrName, cardValue);
    });

    return cardSvg;
}

const transmuters = [
    textTransmuter
];

const conjure = (cardData, templateSvg) => {
    const cardSvg = new DOMParser().parseFromString(templateSvg, "image/svg+xml");
    const cardCtx = vm.createContext(cardData);

    return transmuters.reduce(
        (cardSvg, transmuter) => transmuter(cardCtx, cardSvg),
        cardSvg);
};

module.exports = conjure;
