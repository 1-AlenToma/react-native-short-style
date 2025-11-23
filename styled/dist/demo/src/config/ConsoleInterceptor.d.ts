export declare class ConsoleInterceptor {
    private static original;
    private static enabled;
    /**
     * Apply the interception and filtering logic
     */
    static enable(): void;
    /**
     * Restore original console methods
     */
    static disable(): void;
}
