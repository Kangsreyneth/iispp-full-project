
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  X,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";

import { useSearchIndex } from "@/hooks/useSearchIndex";
import { useLang } from "@/hooks/useLang";
import { searchIndex } from "@/utils/search";

export default function SearchDialog({ onClose }) {
  const { t } = useLang();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const resultRefs = useRef([]);

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const { index, loading } = useSearchIndex();

  const results = useMemo(
    () => searchIndex(index, query).slice(0, 8),
    [index, query]
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    resultRefs.current[activeIndex]?.scrollIntoView?.({
      block: "nearest",
    });
  }, [activeIndex]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const goTo = (path) => {
    onClose?.();
    navigate(path);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!query.trim()) {
      inputRef.current?.focus();
      return;
    }

    goTo(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleInputKeyDown = (event) => {
    if (!results.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        (current + 1) % results.length
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        (current - 1 + results.length) % results.length
      );
    }
  };

  const handleBackdropMouseDown = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 p-4 pt-[10vh]"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("search")}
        className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 border-b border-slate-200 px-4"
        >
          <Search className="h-5 w-5 shrink-0 text-brand-600" />

          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={t("searchPlaceholder")}
            aria-label={t("search")}
            autoComplete="off"
            className="h-14 min-w-0 flex-1 bg-transparent text-base outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onClose?.()}
            aria-label="Close search"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </form>

        <div className="max-h-[55vh] overflow-y-auto">
          {!query.trim() ? (
            <div className="px-5 py-8 text-center">
              <Search className="mx-auto mb-3 h-8 w-8 text-slate-300" />
              <p className="text-sm text-slate-600">
                Search IISPP pages and content
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Try one letter, a page name, or a Khmer keyword.
              </p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center gap-2 px-5 py-8 text-sm text-slate-500">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">
              {t("noResults")}
            </p>
          ) : (
            <>
              <p className="px-5 pb-2 pt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Suggestions ({results.length})
              </p>

              {results.map((result, i) => (
                <Link
                  key={`${result.type}-${result.to}`}
                  ref={(element) => {
                    resultRefs.current[i] = element;
                  }}
                  to={result.to}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => onClose?.()}
                  className={`flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3 last:border-0 ${
                    activeIndex === i
                      ? "bg-brand-50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-brand-900">
                      {result.title}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {result.snippet}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700">
                      {result.type}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                </Link>
              ))}

              <button
                type="button"
                onClick={handleSubmit}
                className="flex w-full items-center justify-center gap-2 bg-slate-50 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
              >
                {t("viewAll")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-2 text-xs text-slate-400">
          <span>IISPP Search</span>
          <span>↑ ↓ Navigate · Enter Search · Esc Close</span>
        </div>
      </div>
    </div>
  );
}
