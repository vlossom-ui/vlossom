export function getPositionProps() {
    return {
        absolute: { type: Boolean, default: false },
        fixed: { type: Boolean, default: false },
        sticky: { type: Boolean, default: false },
        static: { type: Boolean, default: false },
    };
}
