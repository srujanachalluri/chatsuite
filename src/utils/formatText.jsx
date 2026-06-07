// Lightweight, safe markdown-style formatter for chat messages.
// Returns an array of React nodes (never uses dangerouslySetInnerHTML).
// Supported: `code`, links, **bold**, *italic* / _italic_, ~~strike~~

function applyRule(nodes, re, render) {
  const out = [];
  let counter = 0;
  for (const node of nodes) {
    if (typeof node !== 'string') { out.push(node); continue; }
    let lastIndex = 0;
    let match;
    re.lastIndex = 0;
    while ((match = re.exec(node)) !== null) {
      if (match.index > lastIndex) out.push(node.slice(lastIndex, match.index));
      out.push(render(match, `f${counter++}`));
      lastIndex = match.index + match[0].length;
      if (match[0].length === 0) re.lastIndex++; // guard against zero-width loops
    }
    if (lastIndex < node.length) out.push(node.slice(lastIndex));
  }
  return out;
}

export function formatText(text) {
  if (!text) return text;
  let nodes = [text];

  // `code` first so formatting inside code stays literal
  nodes = applyRule(nodes, /`([^`]+)`/g, (m, k) => <code key={k} className="md-code">{m[1]}</code>);
  // links
  nodes = applyRule(nodes, /(https?:\/\/[^\s]+)/g, (m, k) => (
    <a key={k} href={m[1]} target="_blank" rel="noreferrer" className="md-link"
       onClick={(e) => e.stopPropagation()}>{m[1]}</a>
  ));
  // **bold**
  nodes = applyRule(nodes, /\*\*([^*]+)\*\*/g, (m, k) => <strong key={k}>{m[1]}</strong>);
  // ~~strike~~
  nodes = applyRule(nodes, /~~([^~]+)~~/g, (m, k) => <s key={k}>{m[1]}</s>);
  // *italic*
  nodes = applyRule(nodes, /\*([^*\n]+)\*/g, (m, k) => <em key={k}>{m[1]}</em>);
  // _italic_
  nodes = applyRule(nodes, /_([^_\n]+)_/g, (m, k) => <em key={k}>{m[1]}</em>);

  return nodes;
}
