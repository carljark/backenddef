const getInitMediaString = () => {
    const currentWidth = window.innerWidth;
    let currentWidthRule = '(min-width: 1025px)';

    if (currentWidth > 1024) {
        currentWidthRule = '(min-width: 1025px)';
    } else if (currentWidth > 768) {
        currentWidthRule = '(min-width: 769px)';
    } else if (currentWidth > 568) {
        currentWidthRule = '(min-width: 569px)';
    } else if (currentWidth > 320) {
        currentWidthRule = '(min-width: 321px)';
    } else {
        currentWidthRule = '(max-width: 320px)';
    }
    return currentWidthRule;
};

export default getInitMediaString;
