import { useState } from "react";

import Renderer from "../renderer/Renderer";
import { homePage } from "../renderer/demo/homePage";

import { componentRegistry } from "../renderer/registry";
import type {AnyPageBlock, BlockType, PageConfig,} from "../renderer/types";


function isStringArray(value: unknown): value is string[] {
    return (
        Array.isArray(value) &&
        value.every((item) => typeof item === "string")
    );
}


export default function PageEditor() {
    // page 是编辑器当前正在编辑的完整页面。
    // setPage 每次都会根据旧页面生成一个新页面。
    const [page, setPage] = useState<PageConfig>(homePage);

    // 这里只保存被选中区块的 id，不另外保存一份区块副本。
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

    // 每次 page 更新后，都从最新的 page.blocks 中重新寻找选中的区块。
    const selectedBlock = page.blocks.find(
        (block) => block.id === selectedBlockId,
    );

    const selectedDefinition = selectedBlock
        ? componentRegistry[selectedBlock.type]
        : null;


    // 工厂函数：根据区块类型创建一个具有默认 props 的新区块。
    function createBlock(type: BlockType): AnyPageBlock {
        switch (type) {
            case "hero":
                return {
                    id: crypto.randomUUID(),
                    type: "hero",
                    props: {
                        title: "New Hero",
                        subtitle: "",
                    },
                };

            case "feature":
                return {
                    id: crypto.randomUUID(),
                    type: "feature",
                    props: {
                        items: [],
                    },
                };

            case "footer":
                return {
                    id: crypto.randomUUID(),
                    type: "footer",
                    props: {
                        text: "New Footer",
                    },
                };
        }

        // 将来如果 BlockType 增加了新类型，却忘记在上面的 switch 中处理，
        // TypeScript 会在这里提醒我们。
        const exhaustiveCheck: never = type;
        return exhaustiveCheck;
    }


    // 安全读取 props 中的动态字段。
    function readBlockField(block: AnyPageBlock, fieldName: string): unknown {
        if (!Object.hasOwn(block.props, fieldName)) {
            return undefined;
        }

        return Reflect.get(block.props, fieldName);
    }


    // 用新区块替换 page.blocks 中 id 相同的旧区块。
    function updateBlock(updatedBlock: AnyPageBlock) {
        setPage((oldPage) => ({

            ...oldPage,

            blocks: oldPage.blocks.map((block) =>

                block.id === updatedBlock.id
                    ? updatedBlock
                    : block,

            ),

        }));

    }


    function addBlock(type: BlockType) {
        const newBlock = createBlock(type);

        setPage((oldPage) => ({
            ...oldPage,
            blocks: [...oldPage.blocks, newBlock],
        }));

        // 新增后立即选中新区块，方便继续编辑。
        setSelectedBlockId(newBlock.id);
    }


    function deleteBlock(blockId: string) {
        setPage((oldPage) => ({
            ...oldPage,
            blocks: oldPage.blocks.filter((block) => block.id !== blockId),
        }));

        if (selectedBlockId === blockId) {
            setSelectedBlockId(null);
        }
    }


    function updateStringField(block: AnyPageBlock, fieldName: string, newValue: string) {
        if (!Object.hasOwn(block.props, fieldName)) {
            return;
        }

        const oldValue = readBlockField(block, fieldName);

        // schema 和实际 props 不一致时，不进行更新。
        if (typeof oldValue !== "string") {
            return;
        }

        // 不直接修改 React state 中的旧区块。
        const updatedBlock = structuredClone(block);
        const success = Reflect.set(updatedBlock.props, fieldName, newValue);

        if (!success) {
            return;
        }

        updateBlock(updatedBlock);
    }


    function updateStringArrayField(block: AnyPageBlock, fieldName: string, newValue: string[]) {
        if (!Object.hasOwn(block.props, fieldName)) {
            return;
        }

        const oldValue = readBlockField(block, fieldName);

        // 不仅确认它是数组，也确认数组中的每一项都是字符串。
        if (!isStringArray(oldValue)) {
            return;
        }

        const updatedBlock = structuredClone(block);
        const success = Reflect.set(updatedBlock.props, fieldName, newValue);

        if (!success) {
            return;
        }

        updateBlock(updatedBlock);
    }


    function moveBlock(blockId: string, direction: "up" | "down") {
        setPage((oldPage) => {
            const oldIndex = oldPage.blocks.findIndex(
                (block) => block.id === blockId,
            );

            if (oldIndex === -1) {
                return oldPage;
            }

            const newIndex = direction === "up"
                ? oldIndex - 1
                : oldIndex + 1;

            if (newIndex < 0 || newIndex >= oldPage.blocks.length) {
                return oldPage;
            }

            const newBlocks = [...oldPage.blocks];
            const [movedBlock] = newBlocks.splice(oldIndex, 1);

            if (!movedBlock) {
                return oldPage;
            }

            newBlocks.splice(newIndex, 0, movedBlock);

            return {
                ...oldPage,
                blocks: newBlocks,
            };
        });
    }


    return (
        <main className="page-editor">
            <section className="page-editor__blocks">
                <h2>Blocks</h2>

                {page.blocks.length === 0 ? (
                    <p>No blocks yet.</p>
                ) : (
                    <ul>
                        {page.blocks.map((block, index) => (
                            <li key={block.id}>
                                <button
                                    type="button"
                                    aria-pressed={selectedBlockId === block.id}
                                    onClick={() => setSelectedBlockId(block.id)}
                                >
                                    {block.type}
                                    {selectedBlockId === block.id
                                        ? " (selected)"
                                        : ""}
                                </button>

                                <button
                                    type="button"
                                    disabled={index === 0}
                                    onClick={() => moveBlock(block.id, "up")}
                                >
                                    Up
                                </button>

                                <button
                                    type="button"
                                    disabled={index === page.blocks.length - 1}
                                    onClick={() => moveBlock(block.id, "down")}
                                >
                                    Down
                                </button>

                                <button
                                    type="button"
                                    onClick={() => deleteBlock(block.id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="page-editor__add-block">
                <h2>Add block</h2>

                {(Object.keys(componentRegistry) as BlockType[]).map(
                    (componentType) => (
                        <button
                            type="button"
                            key={componentType}
                            onClick={() => addBlock(componentType)}
                        >
                            + Add {componentType}
                        </button>
                    ),
                )}
            </section>

            <section className="page-editor__properties">
                <h2>Properties</h2>

                {selectedBlock && selectedDefinition ? (
                    <div>
                        <p>Selected: {selectedBlock.type}</p>

                        <button
                            type="button"
                            onClick={() => setSelectedBlockId(null)}
                        >
                            Clear selection
                        </button>

                        {Object.entries(selectedDefinition.schema).map(
                            ([fieldName, rule]) => {
                                const fieldValue = readBlockField(
                                    selectedBlock,
                                    fieldName,
                                );

                                const inputId = [
                                    "block-field",
                                    selectedBlock.id,
                                    fieldName,
                                ].join("-");

                                return (
                                    <div key={fieldName}>
                                        <label htmlFor={inputId}>
                                            {fieldName}
                                            {rule.required ? " *" : ""}
                                        </label>

                                        {rule.type === "string" && (
                                            <input
                                                id={inputId}
                                                type="text"
                                                value={
                                                    typeof fieldValue === "string"
                                                        ? fieldValue
                                                        : ""
                                                }
                                                onChange={(event) => {
                                                    updateStringField(
                                                        selectedBlock,
                                                        fieldName,
                                                        event.target.value,
                                                    );
                                                }}
                                            />
                                        )}

                                        {rule.type === "array" && (
                                            <textarea
                                                id={inputId}
                                                rows={6}
                                                value={
                                                    isStringArray(fieldValue)
                                                        ? fieldValue.join("\n")
                                                        : ""
                                                }
                                                onChange={(event) => {
                                                    const text = event.target.value;
                                                    const newItems = text === ""
                                                        ? []
                                                        : text.split("\n");

                                                    updateStringArrayField(
                                                        selectedBlock,
                                                        fieldName,
                                                        newItems,
                                                    );
                                                }}
                                            />
                                        )}
                                    </div>
                                );
                            },
                        )}
                    </div>
                ) : (
                    <p>Select a block.</p>
                )}
            </section>

            <section className="page-editor__preview">
                <h2>Preview</h2>
                <Renderer page={page} />
            </section>
        </main>
    );
}
