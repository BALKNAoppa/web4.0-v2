"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, ArrowRight, X, Clock, Frown, Sparkles, Loader2 } from "lucide-react";

import { tvodMovies, tvodCategories, type TvodCategory, type TvodMovie } from "@/data/tvod-movies";
import { TvodPackages } from "@/components/sections/tvod-packages";
import { MovieCard } from "@/components/sections/tvod-movie-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Tab = "library" | "packages";

const RECENT_KEY = "tvod:recent-searches";
const RECENT_EVENT = "tvod:recent-searches:change";
const RECENT_MAX = 8;
const SUGGEST_LIMIT = 5;
const DEBOUNCE_MS = 200;

// =====================================================================
// localStorage external-store API — useSyncExternalStore-д зориулсан
// React 19-ийн strict mode-д setState in useEffect-г ашиглахгүйн тулд
// localStorage-ийг external store-оор хандана.
// =====================================================================
function subscribeRecent(callback: () => void) {
  // Бусад tab-аас өөрчлөгдөх үед "storage" event
  window.addEventListener("storage", callback);
  // Энэ tab дотроос өөрчлөгдөх үед custom event
  window.addEventListener(RECENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(RECENT_EVENT, callback);
  };
}

function getRecentSnapshot(): string {
  try {
    return localStorage.getItem(RECENT_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function getRecentServerSnapshot(): string {
  return "[]";
}

function writeRecent(value: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(value));
    window.dispatchEvent(new Event(RECENT_EVENT));
  } catch {
    /* алгасна */
  }
}

function clearRecentStorage() {
  try {
    localStorage.removeItem(RECENT_KEY);
    window.dispatchEvent(new Event(RECENT_EVENT));
  } catch {
    /* алгасна */
  }
}

/**
 * TVOD кино каталогын unified компонент:
 *   - Search input + live autocomplete dropdown
 *   - Recent searches (localStorage) — focus үед, query хоосон үед харагдана
 *   - Live filter grid — query байгаа үед үр дүн, үгүй бол "Санал болгох"
 *   - Empty result-д "Үр дүн алга" + recent search chips fallback
 */
export function TvodCatalog() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  /**
   * Баталгаажсан хайлт — зөвхөн submit / suggestion / recent сонголтоор
   * шинэчлэгдэнэ. Доорх grid үүгээр шүүгдэх тул бичиж байх үед dropdown-той
   * давхардахгүй.
   */
  const [committedQuery, setCommittedQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("library");
  const [searchMode, setSearchMode] = useState<"keyword" | "ai">("keyword");

  // AI semantic search state
  const [aiResults, setAiResults] = useState<Array<{ movie: TvodMovie; reason: string }>>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiQuery, setAiQuery] = useState(""); // AI хайлт хийсэн query (display)

  // Recent searches — localStorage-аас useSyncExternalStore-аар уншина
  const recentJson = useSyncExternalStore(
    subscribeRecent,
    getRecentSnapshot,
    getRecentServerSnapshot,
  );
  const recent = useMemo<string[]>(() => {
    try {
      const parsed = JSON.parse(recentJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [recentJson]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce — typing-ийн дараа 200ms хүлээгээд filter ажиллана
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  // Click outside → dropdown хаах
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Dropdown-д харагдах suggestion-ууд — бичиж байх үеийн live шүүлт
  const suggestions = useMemo(
    () => filterMovies(debouncedQuery, tvodMovies).slice(0, SUGGEST_LIMIT),
    [debouncedQuery],
  );

  // Доорх grid — зөвхөн баталгаажсан хайлтаар шүүгдэнэ
  const results = useMemo(() => filterMovies(committedQuery, tvodMovies), [committedQuery]);

  const hasQuery = debouncedQuery.length > 0;
  const hasCommitted = committedQuery.length > 0;
  const hasResults = results.length > 0;

  function commitRecent(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    const next = [
      trimmed,
      ...recent.filter((r) => r.toLowerCase() !== trimmed.toLowerCase()),
    ].slice(0, RECENT_MAX);
    writeRecent(next);
  }

  function clearRecent() {
    clearRecentStorage();
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    // Шинээр бичиж эхэлмэгц өмнөх баталгаажсан үр дүнг арилгана —
    // grid default categories руу буцаж, зөвхөн dropdown ажиллана
    if (committedQuery) setCommittedQuery("");
    // Хайлт эхлэхэд автоматаар Кино сан tab-руу шилжинэ
    if (value.trim() && tab !== "library") setTab("library");
  }

  function handleSelectRecent(q: string) {
    setQuery(q);
    setDebouncedQuery(q);
    setCommittedQuery(q);
    if (tab !== "library") setTab("library");
    setDropdownOpen(false);
  }

  function handleSelectSuggestion(movie: TvodMovie) {
    setQuery(movie.title);
    setDebouncedQuery(movie.title);
    setCommittedQuery(movie.title);
    commitRecent(movie.title);
    if (tab !== "library") setTab("library");
    setDropdownOpen(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (tab !== "library") setTab("library");

    if (searchMode === "ai") {
      // AI хайлт: API дуудах
      runAiSearch();
    } else {
      // Keyword хайлт: үр дүнг grid-д баталгаажуулж, history-д хадгална
      setCommittedQuery(q);
      commitRecent(q);
      setDropdownOpen(false);
    }
  }

  function handleModeChange(next: "keyword" | "ai") {
    setSearchMode(next);
    // AI mode рүү шилжих үед өмнөх AI үр дүн арилгахгүй (хэрэглэгч харж байж магадгүй)
    // Keyword mode рүү шилжих үед dropdown сэргээхгүй
    inputRef.current?.focus();
  }

  /**
   * AI semantic search — /api/semantic-search руу POST хийж үр дүн авна.
   * Дуудагдахад автоматаар Кино сан tab руу шилжинэ.
   */
  async function runAiSearch() {
    const q = query.trim();
    if (!q || aiLoading) return;

    setAiLoading(true);
    setAiError(null);
    setDropdownOpen(false);
    if (tab !== "library") setTab("library");
    commitRecent(q);

    try {
      const res = await fetch("/api/semantic-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Хайлт амжилтгүй");
      }
      setAiResults(Array.isArray(data.results) ? data.results : []);
      setAiQuery(q);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Тодорхойгүй алдаа";
      setAiError(message);
      setAiResults([]);
    } finally {
      setAiLoading(false);
    }
  }

  function clearAi() {
    setAiResults([]);
    setAiQuery("");
    setAiError(null);
  }

  // Search үр дүнгийн title (зөвхөн query байгаа үед харагдана)
  const gridTitle = `Хайлтын үр дүн (${results.length})`;

  return (
    <section aria-labelledby="tvod-catalog-title" className="bg-background">
      <h2 id="tvod-catalog-title" className="sr-only">
        Кино хайх ба үзэх
      </h2>

      {/* ===== Search band — hero-н дороос шууд залгаж байрлана ===== */}
      <div className="bg-muted/60 border-border border-y py-8 lg:py-5">
        <div className="container mx-auto px-4">
          <div ref={wrapperRef} className="mx-auto max-w-2xl">
            <form onSubmit={handleSubmit} className="relative" role="search">
              <label htmlFor="tvod-search" className="sr-only">
                TVOD кино хайх
              </label>
              <div className="border-primary/30 bg-background hover:border-primary/50 focus-within:border-primary focus-within:ring-primary/25 flex h-16 items-center gap-2 rounded-full border-2 pr-2 pl-2 shadow-lg transition-all focus-within:ring-4">
                {/* Mode toggle — зүүн талд segmented icon control + sliding indicator */}
                <div
                  role="group"
                  aria-label="Хайлтын төрөл"
                  className="bg-muted relative flex shrink-0 items-center rounded-full p-0.5"
                >
                  {/* Slide хийдэг background indicator — идэвхтэй товч руу гулсана */}
                  <div
                    className="bg-background absolute top-0.5 size-10 rounded-full shadow-sm transition-all duration-300 ease-out"
                    style={{
                      left: searchMode === "keyword" ? "0.125rem" : "calc(0.125rem + 2.5rem)",
                    }}
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    onClick={() => handleModeChange("keyword")}
                    aria-pressed={searchMode === "keyword"}
                    aria-label="Энгийн түлхүүр үгээр хайх"
                    title="Энгийн хайлт"
                    className={`relative z-10 flex size-10 items-center justify-center rounded-full transition-colors duration-300 ease-out ${
                      searchMode === "keyword"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Search className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange("ai")}
                    aria-pressed={searchMode === "ai"}
                    aria-label="AI-тай хамтарч хайх"
                    title="AI хайлт"
                    className={`relative z-10 flex size-10 items-center justify-center rounded-full transition-colors duration-300 ease-out ${
                      searchMode === "ai"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sparkles className="size-4" aria-hidden="true" />
                  </button>
                </div>

                <input
                  ref={inputRef}
                  id="tvod-search"
                  type="search"
                  role="combobox"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onFocus={() => setDropdownOpen(true)}
                  placeholder={
                    searchMode === "ai"
                      ? "Жишээ нь: GoT шиг кино зөвлө, Tarantino маягийн…"
                      : "Жишээ нь: Dune, Sci-Fi, 2023…"
                  }
                  aria-autocomplete="list"
                  aria-controls="tvod-suggestions"
                  aria-expanded={dropdownOpen}
                  className="placeholder:text-muted-foreground w-full bg-transparent text-base outline-none placeholder:text-sm md:text-lg md:placeholder:text-base [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setDebouncedQuery("");
                      setCommittedQuery("");
                      inputRef.current?.focus();
                    }}
                    className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                    aria-label="Цэвэрлэх"
                  >
                    <X className="size-4" />
                  </button>
                )}

                {/* Submit товч — баруун талд бөмбөлгөн arrow */}
                <button
                  type="submit"
                  disabled={!query.trim() || aiLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-all focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={searchMode === "ai" ? "AI-аар хайх" : "Хайх"}
                >
                  {aiLoading ? (
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="size-5" aria-hidden="true" />
                  )}
                </button>
              </div>

              {dropdownOpen && (
                <SearchDropdown
                  hasQuery={hasQuery}
                  suggestions={suggestions}
                  recent={recent}
                  onSelectSuggestion={handleSelectSuggestion}
                  onSelectRecent={handleSelectRecent}
                  onClearRecent={clearRecent}
                />
              )}
            </form>
          </div>
        </div>
      </div>

      <div id="library" className="container mx-auto scroll-mt-24 px-4 py-12 lg:py-16">
        {/* ===== Tabs (shadcn pill-style segmented, 1200 full-width) ===== */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <TabsList className="h-12 w-full">
            <TabsTrigger value="library" className="flex-1 text-base font-semibold">
              Кино сан
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex-1 text-base font-semibold">
              Кино багц
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="pt-8">
            {/* ===== AI semantic search үр дүн ===== */}
            {aiError && (
              <div className="border-destructive/40 bg-destructive/10 text-destructive mb-6 rounded-xl border p-4 text-sm">
                AI хайлт амжилтгүй: {aiError}
              </div>
            )}

            {aiResults.length > 0 && (
              <div className="mb-12">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-primary flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
                      <Sparkles className="size-4" aria-hidden="true" />
                      AI санал
                    </div>
                    <h3 className="text-foreground mt-1 truncate text-xl font-bold tracking-tight md:text-2xl">
                      &ldquo;{aiQuery}&rdquo; — {aiResults.length} санал
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={clearAi}
                    className="text-muted-foreground hover:text-foreground border-border inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
                  >
                    <X className="size-3.5" aria-hidden="true" />
                    Цэвэрлэх
                  </button>
                </div>

                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {aiResults.map(({ movie, reason }) => (
                    <li key={movie.id}>
                      <MovieCard movie={movie} />
                      {reason && (
                        <p className="text-muted-foreground mt-2 line-clamp-3 text-xs italic">
                          &ldquo;{reason}&rdquo;
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ===== Keyword search / default categories — AI үр дүнгүй үед л.
                 Grid нь зөвхөн баталгаажсан хайлтад харагдана (dropdown-той давхардахгүй) ===== */}
            {aiResults.length === 0 &&
              (hasCommitted ? (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-tight md:text-2xl">{gridTitle}</h3>
                  </div>

                  {hasResults ? (
                    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {results.map((movie) => (
                        <li key={movie.id}>
                          <MovieCard movie={movie} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyResults
                      query={committedQuery}
                      recent={recent}
                      onSelectRecent={handleSelectRecent}
                    />
                  )}
                </>
              ) : (
                <div className="space-y-12">
                  {tvodCategories.map((category) => (
                    <CategoryRow key={category.id} category={category} />
                  ))}
                </div>
              ))}
          </TabsContent>

          <TabsContent value="packages" className="pt-8">
            <TvodPackages />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

// =====================================================================
// SEARCH DROPDOWN — suggestions + recent searches
// =====================================================================
function SearchDropdown({
  hasQuery,
  suggestions,
  recent,
  onSelectSuggestion,
  onSelectRecent,
  onClearRecent,
}: {
  hasQuery: boolean;
  suggestions: TvodMovie[];
  recent: string[];
  onSelectSuggestion: (m: TvodMovie) => void;
  onSelectRecent: (q: string) => void;
  onClearRecent: () => void;
}) {
  const showSuggestions = hasQuery && suggestions.length > 0;
  const showRecent = !hasQuery && recent.length > 0;
  const showNoMatch = hasQuery && suggestions.length === 0;

  if (!showSuggestions && !showRecent && !showNoMatch) return null;

  return (
    <div
      id="tvod-suggestions"
      role="listbox"
      className="bg-card border-border absolute top-full right-0 left-0 z-20 mt-2 max-h-96 overflow-y-auto rounded-2xl border shadow-lg"
    >
      {showSuggestions && (
        <ul className="p-2">
          {suggestions.map((movie) => (
            <li key={movie.id}>
              <button
                type="button"
                role="option"
                aria-selected="false"
                onClick={() => onSelectSuggestion(movie)}
                className="hover:bg-muted focus-visible:bg-muted flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors focus-visible:outline-none"
              >
                <div className="bg-muted relative size-14 shrink-0 overflow-hidden rounded-md">
                  {movie.poster ? (
                    <Image src={movie.poster} alt="" fill sizes="56px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-1">
                      <span className="text-muted-foreground line-clamp-2 text-center text-[10px] font-medium">
                        {movie.title}
                      </span>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{movie.title}</div>
                  <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                      {movie.rating.toFixed(1)}
                    </span>
                    <span>·</span>
                    <span>{movie.year}</span>
                    <span>·</span>
                    <span className="truncate">{movie.genres.join(", ")}</span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {showNoMatch && (
        <div className="p-4 text-center">
          <p className="text-muted-foreground text-sm">Тохирох санал олдсонгүй</p>
        </div>
      )}

      {showRecent && (
        <div className="border-border border-t p-2">
          <div className="flex items-center justify-between px-2 pt-1 pb-2">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Сүүлд хайсан
            </span>
            <button
              type="button"
              onClick={onClearRecent}
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Цэвэрлэх
            </button>
          </div>
          <ul>
            {recent.map((q) => (
              <li key={q}>
                <button
                  type="button"
                  onClick={() => onSelectRecent(q)}
                  className="hover:bg-muted focus-visible:bg-muted flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm transition-colors focus-visible:outline-none"
                >
                  <Clock className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{q}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// EMPTY RESULTS — query байгаа, үр дүн алга үед grid-н оронд харагдана
// =====================================================================
function EmptyResults({
  query,
  recent,
  onSelectRecent,
}: {
  query: string;
  recent: string[];
  onSelectRecent: (q: string) => void;
}) {
  return (
    <div className="bg-muted/30 border-border rounded-2xl border p-8 text-center md:p-12">
      <Frown className="text-muted-foreground mx-auto size-10" aria-hidden="true" />
      <p className="mt-4 text-base font-medium">&ldquo;{query}&rdquo;-д тохирох кино олдсонгүй</p>
      <p className="text-muted-foreground mt-1 text-sm">
        Зөв бичсэн эсэхээ шалгана уу, эсвэл бусад утгаар хайж үзээрэй.
      </p>

      {recent.length > 0 && (
        <div className="mt-6">
          <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            Сүүлд хайсан
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {recent.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onSelectRecent(q)}
                className="bg-card border-border hover:bg-muted inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
              >
                <Clock className="size-3" aria-hidden="true" />
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// CATEGORY ROW — нэг category-н гарчиг + 5 movie card-уудын row
// =====================================================================
function CategoryRow({ category }: { category: TvodCategory }) {
  if (category.movies.length === 0) return null;
  return (
    <div id={`category-${category.id}`} className="scroll-mt-24">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-foreground text-xl font-bold tracking-tight md:text-2xl">
          {category.title}
        </h3>
        <Link
          href={`/entertainment/category/${category.id}`}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          Дэлгэрэнгүй
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {category.movies.map((movie) => (
          <li key={movie.id}>
            <MovieCard movie={movie} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// =====================================================================
// Search логик — substring match, case-insensitive, title + genre + year
// =====================================================================
function filterMovies(query: string, movies: TvodMovie[]): TvodMovie[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // Тоон query — он-той тэнцүү байх match
  const isNumeric = /^\d{4}$/.test(q);

  return movies.filter((m) => {
    if (m.title.toLowerCase().includes(q)) return true;
    if (m.genres.some((g) => g.toLowerCase().includes(q))) return true;
    if (isNumeric && String(m.year) === q) return true;
    return false;
  });
}
