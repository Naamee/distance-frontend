import { useState, useEffect } from "react";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListFilterPlus, FunnelX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type MovieFilters } from "@/types";

export default function SearchFilters({
  isMobile,
  filters,
  setFilters,
}: {
  isMobile: boolean;
  filters: MovieFilters;
  setFilters: (filters: MovieFilters) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const statuses: Record<string, string> = {
    watched: "Watched",
    unwatched: "Unwatched",
  };

  // Automatically show/hide clear filters button
  useEffect(() => {
    if (filters.name || filters.status) {
      setIsFiltersOpen(true);
    } else {
      setIsFiltersOpen(false);
    }
  }, [filters]);
  return (
    <>
      {!isMobile && (
        <FieldSet className="my-4">
          <FieldGroup>
            <div className="md:grid md:grid-cols-12 md:gap-4 space-y-4 md:space-y-0">
              <Field className="md:col-span-8">
                <Input
                  id="name"
                  value={filters.name}
                  autoComplete="off"
                  placeholder="Search"
                  className="h-10 text-sm md:text-base px-4"
                  onChange={(name) =>
                    setFilters({ ...filters, name: name.target.value })
                  }
                />
              </Field>

              <Field
                className={`${isFiltersOpen ? "md:col-span-3" : "md:col-span-4"}`}
              >
                <Select
                  value={filters.status}
                  onValueChange={(status) => setFilters({ ...filters, status })}
                >
                  <SelectTrigger className="!h-10 md:text-base px-4 flex items-center">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statuses).map(([key, label]) => (
                      <SelectItem
                        key={key}
                        className="md:text-base"
                        value={label}
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              {isFiltersOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="md:col-span-1 flex items-center justify-end">
                    <Button
                      onClick={() => setFilters({ name: "", status: "" })}
                      title="Clear filters"
                      className="h-10 w-full md:px-3 whitespace-nowrap text-8xl bg-amber-600/80 border border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 hover:border-amber-600 active:from-amber-400 active:to-amber-500 active:border-amber-700 text-white hover:text-amber-3 00"
                    >
                      <FunnelX />
                      <span className="sr-only">Clear Filters</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </FieldGroup>
        </FieldSet>
      )}

      {isMobile && (
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="flex flex-col gap-2 my-4"
        >
          <div className="flex items-center justify-between gap-3">
            <Field>
              <Input
                id="name"
                value={filters.name}
                autoComplete="off"
                placeholder="Search"
                className="h-10 text-sm md:text-base px-4"
                onChange={(name) =>
                  setFilters({ ...filters, name: name.target.value })
                }
              />
            </Field>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className=" text-white bg-amber-600/80 border border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500"
              >
                <ListFilterPlus />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>

            <Button
              onClick={() => setFilters({ name: "", status: "" })}
              variant="outline"
              size="icon"
              className=" text-white bg-amber-600/80 border border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500"
            >
              <FunnelX />
              <span className="sr-only">Clear Filters</span>
            </Button>
          </div>

          <AnimatePresence>
            {isOpen && (
              <CollapsibleContent className="flex flex-col gap-2">
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden flex flex-col gap-2"
                >
                  <Field>
                    <Select
                      value={filters.status}
                      onValueChange={(status) =>
                        setFilters({ ...filters, status })
                      }
                    >
                      <SelectTrigger className="!h-10 md:text-base px-4 flex items-center">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statuses).map(([key, label]) => (
                          <SelectItem
                            key={key}
                            className="md:text-base"
                            value={label}
                          >
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </motion.div>
              </CollapsibleContent>
            )}
          </AnimatePresence>
        </Collapsible>
      )}
    </>
  );
}
