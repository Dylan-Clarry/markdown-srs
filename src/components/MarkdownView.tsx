import React from "react";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkReact from "remark-react";
import "github-markdown-css/github-markdown.css";

interface Props {
    doc: string;
}

export default function RemarkView({ doc }: Props) {
    const md = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkReact, { createElement: React.createElement as any })
        .processSync(doc).result;
    return (
        <div className="markdown-body p-4 ml-4 h-[48%]">
            <>{md}</>
        </div>
    );
}

