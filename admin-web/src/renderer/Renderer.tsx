import {validateProps} from "./validator";
import {componentRegistry} from "./registry";

import type {PageConfig, PageBlock, BlockType,BlockPropsMap} from "./types";

type RendererProps={page: PageConfig;};


function renderBlock<T extends BlockType> (block: PageBlock<T>) {

    const definition =
        componentRegistry[block.type];

    const props =
        validateProps<BlockPropsMap[T]>(
            block.props,
            definition.schema
        );

    const Component =
        definition.component;

    return (
        <Component
            key={block.id}
            {...props}
        />
    );
}


export default function Renderer({ page }: RendererProps) {

    return (
        <>
            {
                page.blocks.map(
                    (block) =>
                        renderBlock(block)
                )
            }
        </>
    );
}