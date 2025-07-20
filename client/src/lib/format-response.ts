interface ListItem {
  type: "bullet" | "number";
  content: string;
}

interface Block {
  type: "text" | "list";
  content: string | ListItem[];
}

export function formatResponse(text: string): Block[] {
  if (!text) return [];

  const lines = text.split("\n");
  const blocks: Block[] = [];
  let currentList: ListItem[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({ type: "list", content: [...currentList] });
      currentList = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed.match(/^[-*•]\s+/)) {
      currentList.push({
        type: "bullet",
        content: trimmed.replace(/^[-*•]\s+/, ""),
      });
    } else if (trimmed.match(/^\d+\.\s+/)) {
      currentList.push({
        type: "number",
        content: trimmed.replace(/^\d+\.\s+/, ""),
      });
    } else {
      flushList();
      blocks.push({ type: "text", content: trimmed });
    }
  }

  flushList();
  return blocks;
}
