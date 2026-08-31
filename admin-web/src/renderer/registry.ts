// 把名字、组件、Schema 绑定起来 联系Schemas 输出Component和Schemas 组件注册中间件 由Renderer调用
import type {ComponentType} from "react";
import type {ComponentSchema} from "./schemas";
import type {BlockPropsMap, BlockType} from "./types";

import Hero from "./components/Hero";
import Feature from "./components/Feature";
import Footer from "./components/Footer";
import {HeroSchema, FeatureSchema, FooterSchema}from "./schemas";


export type ComponentDefinition<
    K extends BlockType> = {

    component:
        ComponentType<BlockPropsMap[K]>;

    schema:
        ComponentSchema<BlockPropsMap[K]>;
};


export type ComponentRegistry = {
    [K in BlockType]:
        ComponentDefinition<K>;
};


export const componentRegistry:
    ComponentRegistry = {

    hero: {
        component: Hero,
        schema: HeroSchema
    },

    feature: {
        component: Feature,
        schema: FeatureSchema
    },

    footer: {
        component: Footer,
        schema: FooterSchema
    }

};