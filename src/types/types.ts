export interface SubNote {
    _id: string,
    text: string
}

export interface Note {
    _id: string,
    text: string,
    order: number,
    sub_notes: SubNote[]
}
