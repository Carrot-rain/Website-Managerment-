// 规定合法的组件类型和 Props 搭配 将page和props关联传入 中间件 由Renderer调用
import type {HeroProps} from "./components/Hero";
import type {FeatureProps} from "./components/Feature";
import type {FooterProps} from "./components/Footer";


// 组件类型 → 组件 Props 的映射表
export type BlockPropsMap = {
    hero: HeroProps;
    feature: FeatureProps;
    footer: FooterProps;
};


/*
 * keyof自动推导 取所有 key 
 * 自动得到："hero" | "feature" | "footer"
 */
export type BlockType =
    keyof BlockPropsMap;


/*
 * 通用 Block 模板
 * T 决定：type 是什么 props 就必须是什么
 */
export type PageBlock<T extends BlockType> = {
    id: string;
    type: T;
    props: BlockPropsMap[T];
};


/*
 * 自动生成联合类型
 * 当前系统允许出现的所有 Block
 */
export type AnyPageBlock = {
    [K in BlockType]: PageBlock<K>;
}[BlockType];


/*
 * 页面状态
 */
export type PageStatus =
    | "draft"
    | "published";

    
/*
 * SEO 信息
 */
export type SeoConfig = {
    title?: string;
    description?: string;
};


/*
 * 一个完整页面的配置格式
 */
export type PageConfig = {
    id: string;
    siteId: string;
    slug: string;
    title: string;
    status: PageStatus;
    schemaVersion: number;
    seo?: SeoConfig;
    blocks: AnyPageBlock[];
};

// export type PageConfig={
    // title:string;
    // blocks:AnyPageBlock[];
// }