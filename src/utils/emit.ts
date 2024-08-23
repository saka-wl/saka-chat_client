
// export default {
//     map: new Map<string, Function>(),
//     $on: function(mapName: string, handler: Function) {
//         this.map.set(mapName, handler);
//     },
//     $off: function(mapName: string, cb: Function) {
//         if (!this.map.has(mapName)) return;
//         this.map.delete(mapName);
//         cb && cb();
//     },
//     $emit: function(mapName: string, ... args: Array<any>) {
//         if (!this.map.has(mapName)) return;
//         (this.map.get(mapName) as Function)(... args);
//     }
// }

const map = new Map<string, Function>();

export const $on = (mapName: string, handler: Function) => {
    map.set(mapName, handler);
}

export const $off = (mapName: string, cb: Function = () => {}) => {
    if (!map.has(mapName)) return;
    map.delete(mapName);
    cb && cb();
}

export const $emit = (mapName: string, ... args: Array<any>) => {
    if (!map.has(mapName)) return;
    (map.get(mapName) as Function)(... args);
}