import React from "react";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkReact from "remark-react";
import "github-markdown-css/github-markdown.css";

interface Props {
    doc: string;
}

export default function MarkdownView({ doc }: Props) {
    const md = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkReact, { createElement: React.createElement as any })
        .processSync(doc).result;
    return (
        <div className="markdown-body h-1/2 p-4">
            <>{md}</>
        </div>
    );
}
