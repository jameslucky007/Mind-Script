// MarkdownRenderer.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { duotoneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Map some common aliases the models output
const langAlias = (lang = "") => {
  const l = lang.toLowerCase();
  if (l === "ts" || l === "typescript") return "typescript";
  if (l === "tsx") return "tsx";
  if (l === "js" || l === "javascript") return "javascript";
  if (l === "json") return "json";
  if (l === "bash" || l === "sh" || l === "shell") return "bash";
  if (l === "py" || l === "python") return "python";
  if (l === "html") return "html";
  if (l === "css") return "css";
  return ""; // let highlighter try auto
};

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        // Inline code
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          if (inline) {
            return (
              <code className="md-inline-code" {...props}>
                {children}
              </code>
            );
          }
          const lang = langAlias(match?.[1] || "");
          return (
            <div className="codeblock">
              <div className="codeblock-top">
                <span className="lang">{lang || "text"}</span>
                <button
                  className="copy"
                  onClick={() =>
                    navigator.clipboard.writeText(String(children))
                  }
                  aria-label="Copy code"
                  type="button"
                >
                  Copy
                </button>
              </div>
              <SyntaxHighlighter
                language={lang || undefined}
                style={duotoneDark}
                wrapLongLines={true}
                customStyle={{
                  margin: 0,
                  //   background: "transparent",
                  fontSize: "0.95rem",
                }}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          );
        },
        // Paragraphs / lists spacing tweaks (optional)
        p({ children }) {
          return <p className="md-p">{children}</p>;
        },
        ul({ children }) {
          return <ul className="md-ul">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="md-ol">{children}</ol>;
        },
        blockquote({ children }) {
          return <blockquote className="md-blockquote">{children}</blockquote>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
