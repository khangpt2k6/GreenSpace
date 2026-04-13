"use client";

import { useEffect, useRef, useState } from "react";
import { FiSend, FiX, FiSearch, FiMap, FiBarChart2, FiClipboard } from "react-icons/fi";
import { MdEco } from "react-icons/md";

const QUICK_PROMPTS = [
  { icon: <FiSearch size={13} />, text: "How do I analyze a product?" },
  { icon: <FiMap size={13} />, text: "What volunteer opportunities are in Tampa?" },
  { icon: <FiBarChart2 size={13} />, text: "How does the sustainability score work?" },
  { icon: <FiClipboard size={13} />, text: "What is the semester project about?" }
];

// Minimal markdown renderer — bold, inline code, bullet lists, headers, line breaks
function renderMarkdown(text) {
  const lines = text.split("\n");
  const elements = [];
  let listBuffer = [];
  let key = 0;

  function flushList() {
    if (!listBuffer.length) return;
    elements.push(
      <ul key={`ul-${key++}`} className="chatMarkdownList">
        {listBuffer.map((item, i) => (
          <li key={i}>{parseInline(item)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  }

  function parseInline(str) {
    const parts = [];
    const regex = /(\*\*(.+?)\*\*|`(.+?)`)/g;
    let last = 0;
    let match;
    while ((match = regex.exec(str)) !== null) {
      if (match.index > last) parts.push(str.slice(last, match.index));
      if (match[2]) parts.push(<strong key={match.index}>{match[2]}</strong>);
      else if (match[3]) parts.push(<code key={match.index} className="chatCode">{match[3]}</code>);
      last = match.index + match[0].length;
    }
    if (last < str.length) parts.push(str.slice(last));
    return parts;
  }

  lines.forEach((line) => {
    const bulletMatch = line.match(/^[-*•]\s+(.+)/);
    const h3Match = line.match(/^###\s+(.+)/);
    const h2Match = line.match(/^##\s+(.+)/);

    if (bulletMatch) {
      listBuffer.push(bulletMatch[1]);
    } else {
      flushList();
      if (!line.trim()) {
        elements.push(<div key={key++} className="chatLineBreak" />);
      } else if (h3Match) {
        elements.push(<p key={key++} className="chatSubheading">{parseInline(h3Match[1])}</p>);
      } else if (h2Match) {
        elements.push(<p key={key++} className="chatHeading">{parseInline(h2Match[1])}</p>);
      } else {
        elements.push(<p key={key++} className="chatPara">{parseInline(line)}</p>);
      }
    }
  });

  flushList();
  return elements;
}

function ThinkingAnimation() {
  return (
    <div className="chatThinking">
      <div className="chatThinkingDots">
        <span /><span /><span />
      </div>
      <span className="chatThinkingLabel">GreenCart AI is thinking...</span>
    </div>
  );
}

function ChatMessage({ message, isNew }) {
  const isUser = message.role === "user";
  return (
    <div className={`chatMsg ${isUser ? "chatMsg--user" : "chatMsg--ai"} ${isNew ? "chatMsg--new" : ""}`}>
      {!isUser && (
        <div className="chatAvatarWrap">
          <MdEco size={17} style={{ color: "var(--accent)" }} />
        </div>
      )}
      <div className={`chatBubbleBody ${isUser ? "chatBubbleBody--user" : "chatBubbleBody--ai"}`}>
        {isUser
          ? <p className="chatPara">{message.content}</p>
          : renderMarkdown(message.content)
        }
      </div>
    </div>
  );
}

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm **GreenCart AI**\n\nAsk me anything about:\n- Sustainability scoring & product analysis\n- Tampa volunteer opportunities\n- Your IDH 3350 semester project\n- How to use this platform"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [newMsgIndex, setNewMsgIndex] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, open]);

  async function sendMessage(text) {
    const content = (text || input).trim();
    if (!content || loading) return;

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setNewMsgIndex(nextMessages.length - 1);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });
      const data = await res.json();
      const reply = data.content || data.error || "Something went wrong.";
      const withReply = [...nextMessages, { role: "assistant", content: reply }];
      setMessages(withReply);
      setNewMsgIndex(withReply.length - 1);
      if (!open) setUnread((n) => n + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "**Network error** — please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {open && (
        <div className="chatWindow" role="dialog" aria-label="GreenCart AI Chat">

          {/* Header */}
          <div className="chatHeader">
            <div className="chatHeaderLeft">
              <div className="chatHeaderAvatar">
                <MdEco size={20} style={{ color: "#fff" }} />
              </div>
              <div>
                <p className="chatHeaderTitle">GreenCart AI</p>
                <p className="chatHeaderSub">
                  <span className="chatOnlineDot" />
                  Sustainability assistant
                </p>
              </div>
            </div>
            <button className="chatClose" onClick={() => setOpen(false)} aria-label="Close">
              <FiX size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="chatBody" ref={bodyRef}>
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} isNew={i === newMsgIndex} />
            ))}
            {loading && (
              <div className="chatMsg chatMsg--ai chatMsg--new">
                <div className="chatAvatarWrap">
                  <MdEco size={17} style={{ color: "var(--accent)" }} />
                </div>
                <ThinkingAnimation />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 2 && (
            <div className="chatQuickPrompts">
              <p className="chatQuickLabel">Quick questions</p>
              <div className="chatQuickGrid">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.text}
                    type="button"
                    className="chatQuickBtn"
                    onClick={() => sendMessage(prompt.text)}
                    disabled={loading}
                  >
                    <span className="chatQuickIcon">{prompt.icon}</span>
                    <span>{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="chatFooter">
            <textarea
              ref={inputRef}
              className="chatInput"
              placeholder="Ask anything about sustainability..."
              value={input}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button
              type="button"
              className={`chatSend ${input.trim() && !loading ? "chatSend--active" : ""}`}
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              <FiSend size={15} />
            </button>
          </div>

        </div>
      )}

      {/* Floating bubble */}
      <button
        className={`chatBubble ${open ? "chatBubble--open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle AI chat"
      >
        <span className="chatBubbleIcon">
          {open ? <FiX size={22} /> : <MdEco size={26} />}
        </span>
        {!open && unread > 0 && <span className="chatUnread">{unread}</span>}
      </button>
    </>
  );
}
