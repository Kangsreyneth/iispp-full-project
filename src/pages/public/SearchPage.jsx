
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import CoverImage from "@/components/ui/CoverImage";

import { useSearchIndex } from "@/hooks/useSearchIndex";
import { useLang } from "@/hooks/useLang";
import { searchIndex } from "@/utils/search";
import { formatDate } from "@/utils/format";

export default function SearchPage() {
  const { t } = useLang();
  const [params, setParams] = useSearchParams();

  const q = params.get("q") || "";
  const { index, loading } = useSearchIndex();

  const results = useMemo(
    () => searchIndex(index, q),
    [index, q]
  );

  const handleChange = (event) => {
    const value = event.target.value;

    if (value) {
      setParams({ q: value }, { replace: true });
    } else {
      setParams({}, { replace: true });
    }
  };

  return (
    <>
      <PageHeader
        title={t("search")}
        crumbs={[[t("search")]]}
      />

      <main className="container-page max-w-4xl py-12">
        <form
          role="search"
          onSubmit={(event) => event.preventDefault()}
          className="relative mb-8"
        >
          <Search className="absolute left-4 top-4 h-5 w-5 text-brand-600" />

          <input
            type="search"
            value={q}
            onChange={handleChange}
            placeholder={t("searchPlaceholder")}
            aria-label={t("search")}
            autoComplete="off"
            autoFocus
            className="w-full rounded-full border border-slate-300 py-3.5 pl-12 pr-5 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </form>

        {loading ? (
          <Spinner />
        ) : !q.trim() ? (
          <EmptyState
            title="Search the website"
            text="Type a word to search news, events, programs and faculties."
          />
        ) : results.length === 0 ? (
          <EmptyState
            title={t("noResults")}
            text={`Nothing matched "${q}".`}
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {results.length} result
              {results.length === 1 ? "" : "s"} for “{q}”
            </p>

            <div className="space-y-3">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.to}`}
                  to={result.to}
                  className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-brand-300 hover:shadow-md"
                >
                  <div className="w-24 shrink-0 overflow-hidden rounded-lg">
                    <CoverImage
                      src={result.image}
                      alt={result.title}
                      ratio="aspect-[4/3]"
                      shade={false}
                    />
                  </div>

                  <div className="min-w-0 flex-1 py-1">
                    <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                      {result.type}
                    </span>

                    <h3 className="mt-2 font-display text-lg font-bold text-brand-900 transition group-hover:text-brand-600">
                      {result.title}
                    </h3>

                    <p className="line-clamp-2 text-sm text-slate-600">
                      {result.snippet}
                    </p>

                    {result.date && (
                      <p className="mt-2 text-xs text-slate-400">
                        {formatDate(result.date)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
