import { useState, useEffect } from "react";
import { BugIcon, CheckIcon, CopyIcon, ArrowUpRightIcon } from "./Icons";
import { REPO_URL, copyText } from "../lib/site";
import { triggerConfetti } from "../lib/confetti";

type BugReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function BugReportModal({ isOpen, onClose }: BugReportModalProps) {
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("UI / Mobile");
  const [description, setDescription] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const buildBody = () => {
    return `### Area\n${area}\n\n### Description\n${description || "No description provided."}\n\n---\n*Reported from skillport web app*`;
  };

  const handleGitHubOpen = () => {
    const issueTitle = encodeURIComponent(title.trim() ? `[Bug]: ${title.trim()}` : "[Bug] Report from skillport");
    const issueBody = encodeURIComponent(buildBody());
    const url = `${REPO_URL}/issues/new?title=${issueTitle}&body=${issueBody}&labels=bug`;
    window.open(url, "_blank", "noreferrer");
    onClose();
  };

  const handleCopyReport = async () => {
    const text = `**Issue**: ${title.trim() || "Untitled bug"}\n**Area**: ${area}\n\n${description || "No description"}`;
    if (await copyText(text)) {
      setCopied(true);
      triggerConfetti();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="bug-modal-title">
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title-row">
            <span className="modal-icon-wrap" aria-hidden="true">
              <BugIcon size={16} />
            </span>
            <h3 id="bug-modal-title">Report a Bug</h3>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>

        <p className="modal-desc">
          Hit an issue with the MCP endpoint, registry search, or interface? Let us know so we can fix it right away.
        </p>

        <div className="modal-form">
          <label className="modal-field">
            <span className="modal-label">Title</span>
            <input
              type="text"
              placeholder="e.g. MCP SSE connection timeout or mobile layout glitch"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="modal-input"
              autoFocus
            />
          </label>

          <label className="modal-field">
            <span className="modal-label">Category</span>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="modal-select"
            >
              <option value="UI / Mobile">UI & Mobile Layout</option>
              <option value="MCP Endpoint">MCP Endpoint & Server</option>
              <option value="Skills Registry">Skills Registry & Search</option>
              <option value="Skill Content">Specific Skill Content</option>
              <option value="Other">Other / Feature Suggestion</option>
            </select>
          </label>

          <label className="modal-field">
            <span className="modal-label">Details</span>
            <textarea
              rows={3}
              placeholder="Describe what happened, what device or client you used, and any error message..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="modal-textarea"
            />
          </label>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="button ghost small"
            onClick={handleCopyReport}
          >
            {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
            {copied ? "Copied" : "Copy details"}
          </button>

          <div className="modal-actions-right">
            <button type="button" className="button small" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="button primary small"
              onClick={handleGitHubOpen}
            >
              Submit on GitHub
              <ArrowUpRightIcon size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
