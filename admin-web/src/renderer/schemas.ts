// 把 Props 要求变成运行时可读取的规则
import type {HeroProps} from "./components/Hero";
import type {FeatureProps} from "./components/Feature";
import type {FooterProps} from "./components/Footer";

// 联合类型
export type FieldType =
    | "string"
    | "array"
    | "number"
    | "boolean";

// 验证规则
export type FieldSchema = {
    type: FieldType;
    required?: boolean;
    default?: unknown;
};

export type FieldSchemaFor<T> =

    T extends string
        ? {
            type: "string";
            required?: boolean;
            default?: string;
        }

    : T extends number
        ? {
            type: "number";
            required?: boolean;
            default?: number;
        }

    : T extends boolean
        ? {
            type: "boolean";
            required?: boolean;
            default?: boolean;
        }

    : T extends readonly unknown[]
        ? {
            type: "array";
            required?: boolean;
            default?: T;
        }

    : never;

// 类型映射 输入Props
export type ComponentSchema<P> = {
    [K in keyof P]: FieldSchemaFor<P[K]>;
};


export const HeroSchema = {
    title: {
        type: "string",
        required: true
    },

    subtitle: {
        type: "string",
        required: true
    }

} satisfies ComponentSchema<HeroProps>;


export const FeatureSchema = {
    items:{
        type: "array",
        required:true
    }
}  satisfies ComponentSchema<FeatureProps>;


export const FooterSchema = {
    text:{
        type: "string",
        required:true
    }
}  satisfies ComponentSchema<FooterProps>;