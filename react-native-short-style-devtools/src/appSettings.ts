export default class AppSettings {
    zoom: number = 1;
    elementSelection: boolean = false;
    consoleData: {
        errors: any[],
        warnings: any[],
        infos: any[],
        logs: any[],
    } = {
            errors: [],
            warnings: [],
            infos: [],
            logs: []
        }
}