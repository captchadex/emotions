import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FormattedResponseProps {
  blocks: {
    type: "text" | "list";
    content: string | Array<{ type: string; content: string }>;
  }[];
}

export function FormattedResponse({ blocks }: FormattedResponseProps) {
  // Convert blocks to markdown string
  const markdownContent = blocks
    .map((block) => {
      if (block.type === "text") {
        return block.content as string;
      } else if (block.type === "list") {
        const items = block.content as Array<{ type: string; content: string }>;
        return items
          .map(
            (item) => `${item.type === "bullet" ? "-" : "1."} ${item.content}`
          )
          .join("\n");
      }
      return "";
    })
    .join("\n\n");

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Override default components to add Tailwind classes
          p: ({ children }) => <p className="mt-4 first:mt-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc ml-6 my-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ml-6 my-4">{children}</ol>
          ),
          li: ({ children }) => <li className="mt-2">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          code: ({ children, className }) => {
            const isInline = !className?.includes("language-");
            return isInline ? (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
                {children}
              </code>
            ) : (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{children}</code>
              </pre>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4">
              {children}
            </blockquote>
          ),
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}
