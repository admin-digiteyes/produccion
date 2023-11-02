export interface IDrawerMenu {
    id: number;
    title: string;
    subtitle: string;
    options: IDrawerOption[];
}

export interface IDrawerOption {
    id: number;
    icon: string;
    img?: boolean;
    title: string;
    route: string;
}
