// 按 Schema 检查实际数据 联系Schemas和实际Props值 对比中间件 运行时校验 由Renderer调用
import type { ComponentSchema } from "./schemas";

export function validateProps<P extends object>(
    props: unknown,
    schema: ComponentSchema<P>
): P {

    if (
        typeof props !== "object" ||
        props === null ||
        Array.isArray(props)
    ) {
        throw new Error("props must be an object");
    }

    const input = props as Record<string, unknown>;
    const result: Partial<P> = {};

    for (const key in schema) {

        const rule = schema[key];
        const value = input[key];

        if (value === undefined) {

            if (rule.required) {
                throw new Error(`${key} is required`);
            }

            if (rule.default !== undefined) {
                result[key] =
                    rule.default as P[
                        Extract<keyof P, string>
                    ];
            }

            continue;
        }

        switch (rule.type) {

            case "string":
                if (typeof value !== "string") {
                    throw new Error(
                        `${key} must be string`
                    );
                }
                break;

            case "array":
                if (!Array.isArray(value)) {
                    throw new Error(
                        `${key} must be array`
                    );
                }
                break;

            case "number":
                if (typeof value !== "number") {
                    throw new Error(
                        `${key} must be number`
                    );
                }
                break;

            case "boolean":
                if (typeof value !== "boolean") {
                    throw new Error(
                        `${key} must be boolean`
                    );
                }
                break;
        }

        result[key] =
            value as P[
                Extract<keyof P, string>
            ];
    }

    return result as P;
}