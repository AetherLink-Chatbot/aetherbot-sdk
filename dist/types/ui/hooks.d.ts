export declare function useLocalStorage<T>(key: string, initial: T): readonly [T, import("react").Dispatch<import("react").SetStateAction<T>>];
export declare function useChime(enabled: boolean): {
    readonly play: (freq?: number, durationMs?: number) => void;
    readonly chord: () => void;
};
