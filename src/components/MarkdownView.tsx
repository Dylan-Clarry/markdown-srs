import React from "react";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkReact from "remark-react";
import "github-markdown-css/github-markdown.css";

export default function MarkdownView({ doc, optionalClass = "" }: { doc: string, optionalClass?: string }) {
    const md = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkReact, { createElement: React.createElement as any })
        .processSync(doc).result;
    return (
        <div className={optionalClass + "  h-1/2 p-4"}>
            <>{md}</>
        </div>
    );
}
