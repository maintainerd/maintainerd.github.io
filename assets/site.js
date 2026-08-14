const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const topNav = document.querySelector("[data-top-nav]");
if (topNav) {
  const currentPath = window.location.pathname;
  topNav.querySelectorAll("a[href^='/']").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const isCurrent = href !== "/" && (currentPath === href || currentPath.startsWith(href));
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

const serviceFilter = document.querySelector("[data-service-filter]");
if (serviceFilter) {
  const sections = Array.from(document.querySelectorAll("[data-service-category]"));
  const applyServiceFilter = () => {
    const value = serviceFilter.value;
    sections.forEach((section) => {
      section.hidden = value !== "all" && section.getAttribute("data-service-category") !== value;
    });
  };
  serviceFilter.addEventListener("change", applyServiceFilter);
  applyServiceFilter();
}
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.getAttribute("data-copy") || "";
    try {
      await navigator.clipboard.writeText(text);
      const previous = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => { button.textContent = previous; }, 1200);
    } catch {
      button.textContent = "Copy failed";
    }
  });
});

const escapeHTML = (value) => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

const inlineMarkdown = (value) => {
  let html = escapeHTML(value);
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return html;
};

const tableCells = (line) => {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return null;
  return trimmed.slice(1, -1).split("|").map((cell) => cell.trim());
};

const isTableSeparator = (cells) => (
  Array.isArray(cells) &&
  cells.length > 0 &&
  cells.every((cell) => /^:?-{3,}:?$/.test(cell))
);

const renderMarkdown = (source) => {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let listType = null;
  let code = null;
  let table = null;
  let pendingTableHeader = null;

  const closeParagraph = () => {
    if (pendingTableHeader) {
      paragraph.push(`| ${pendingTableHeader.join(" | ")} |`);
      pendingTableHeader = null;
    }
    if (!paragraph.length) return;
    html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };

  const closeTable = () => {
    if (!table) return;
    const head = table.header
      .map((cell) => `<th>${inlineMarkdown(cell)}</th>`)
      .join("");
    const rows = table.rows
      .map((row) => {
        const cells = table.header.map((_, index) => `<td>${inlineMarkdown(row[index] || "")}</td>`).join("");
        return `<tr>${cells}</tr>`;
      })
      .join("");
    html.push(`<div class="table-scroll"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`);
    table = null;
  };

  const closeCode = () => {
    if (code === null) return;
    html.push(`<pre><code>${escapeHTML(code.join("\n"))}</code></pre>`);
    code = null;
  };

  lines.forEach((line) => {
    if (line.startsWith("```")) {
      if (code === null) {
        closeParagraph();
        closeList();
        closeTable();
        code = [];
      } else {
        closeCode();
      }
      return;
    }

    if (code !== null) {
      code.push(line);
      return;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      closeParagraph();
      closeList();
      closeTable();
      return;
    }

    const cells = tableCells(trimmed);
    if (table && cells && !isTableSeparator(cells)) {
      table.rows.push(cells);
      return;
    }
    if (table) {
      closeTable();
    }
    if (pendingTableHeader) {
      if (isTableSeparator(cells)) {
        closeList();
        table = { header: pendingTableHeader, rows: [] };
        pendingTableHeader = null;
        return;
      }
      paragraph.push(`| ${pendingTableHeader.join(" | ")} |`);
      pendingTableHeader = null;
    }
    if (cells) {
      closeParagraph();
      closeList();
      pendingTableHeader = cells;
      return;
    }

    const heading = /^(#{1,4})\s+(.+)$/.exec(trimmed);
    if (heading) {
      closeParagraph();
      closeList();
      closeTable();
      const level = heading[1].length;
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      return;
    }

    const unordered = /^[-*]\s+(.+)$/.exec(trimmed);
    if (unordered) {
      closeParagraph();
      if (listType !== "ul") {
        closeList();
        html.push("<ul>");
        listType = "ul";
      }
      html.push(`<li>${inlineMarkdown(unordered[1])}</li>`);
      return;
    }

    const ordered = /^\d+\.\s+(.+)$/.exec(trimmed);
    if (ordered) {
      closeParagraph();
      if (listType !== "ol") {
        closeList();
        html.push("<ol>");
        listType = "ol";
      }
      html.push(`<li>${inlineMarkdown(ordered[1])}</li>`);
      return;
    }

    closeList();
    paragraph.push(trimmed);
  });

  closeCode();
  closeParagraph();
  closeList();
  closeTable();
  return html.join("\n");
};

const markdownTarget = document.querySelector("[data-md-target]");
const markdownNav = document.querySelector("[data-md-nav]");
if (markdownTarget && markdownNav) {
  const links = Array.from(markdownNav.querySelectorAll("[data-md-src]"));

  const setActive = (activeLink) => {
    links.forEach((link) => {
      if (link === activeLink) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const loadSection = async (link, pushState = true) => {
    if (!link) return;
    setActive(link);
    markdownTarget.innerHTML = '<p class="loading-text">Loading section...</p>';
    try {
      const response = await fetch(link.getAttribute("data-md-src"), { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const markdown = await response.text();
      markdownTarget.innerHTML = `<div class="markdown-content">${renderMarkdown(markdown)}</div>`;
      if (pushState) {
        history.replaceState(null, "", link.getAttribute("href"));
      }
    } catch {
      markdownTarget.innerHTML = "<h2>Section unavailable</h2><p>The Markdown file for this section could not be loaded. Try refreshing the page from the site server.</p>";
    }
  };

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      loadSection(link);
    });
  });

  const findLinkForHash = () => links.find((link) => link.getAttribute("href") === window.location.hash);
  const initial = findLinkForHash() || links[0];
  loadSection(initial, false);

  window.addEventListener("hashchange", () => {
    loadSection(findLinkForHash() || links[0], false);
  });
}
