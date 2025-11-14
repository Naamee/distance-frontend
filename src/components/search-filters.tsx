import { useState } from "react";
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

interface Filters {
  item: string;
  category: string;
  status: string;
}

export default function SearchFilters({
  isMobile,
  filters,
  setFilters,
}: {
  isMobile: boolean;
  filters: Filters;
  setFilters: (filters: Filters) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const categories: Record<string, string> = {
    food: "Food",
    cleaning: "Cleaning Supplies",
    cosmetics: "Cosmetics",
    medicine: "Medicine",
    kitchen: "Kitchen / Cooking Essentials",
    hardware: "Hardware Tools",
  };
  const statuses: Record<string, string> = {
    available: "Available",
    unavailable: "Unavailable",
  };

  return (
    <>
      {!isMobile && (
        <FieldSet className="my-4">
          <FieldGroup>
            <div className="md:grid md:grid-cols-12 md:gap-4 space-y-4 md:space-y-0">
              <Field className="md:col-span-4">
                <Input
                  id="item"
                  value={filters.item}
                  autoComplete="off"
                  placeholder="Item Name"
                  className="h-10 text-sm md:text-base px-4"
                  onChange={(item) =>
                    setFilters({ ...filters, item: item.target.value })
                  }
                />
              </Field>

              <Field className="md:col-span-4">
                <Select
                  value={filters.category}
                  onValueChange={(category) =>
                    setFilters({ ...filters, category })
                  }
                >
                  <SelectTrigger className="!h-10 md:text-base px-4 flex items-center">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categories).map(([key, label]) => (
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

              <Field className="md:col-span-3">
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

              <div className="md:col-span-1 flex items-center justify-end">
                <Button
                  onClick={() =>
                    setFilters({ item: "", category: "", status: "" })
                  }
                  title="Clear filters"
                  className="h-10 w-full md:px-3 whitespace-nowrap text-8xl bg-gradient-to-b from-amber-500 to-amber-600 border-amber-400 hover:from-amber-400 hover:to-amber-600 hover:border-amber-600 active:from-amber-400 active:to-amber-500 active:border-amber-700 text-white hover:text-amber-3 00"
                >
                  <FunnelX />
                  <span className="sr-only">Clear Filters</span>
                </Button>
              </div>
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
                id="item"
                value={filters.item}
                autoComplete="off"
                placeholder="Item Name"
                className="h-10 text-sm md:text-base px-4"
                onChange={(item) =>
                  setFilters({ ...filters, item: item.target.value })
                }
              />
            </Field>
                          <CollapsibleTrigger asChild>
                <Button variant="outline" size="icon" className=" text-white bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500"
>
                  <ListFilterPlus />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>

              <Button
                onClick={() =>
                  setFilters({ item: "", category: "", status: "" })
                }
                variant="outline"
                size="icon"
                className=" text-white bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500"
              >
                <FunnelX />
                <span className="sr-only">Clear Filters</span>
              </Button>
          </div>


          <CollapsibleContent className="flex flex-col gap-2">
            <Field>
              <Select
                value={filters.category}
                onValueChange={(category) =>
                  setFilters({ ...filters, category })
                }
              >
                <SelectTrigger className="!h-10 md:text-base px-4 flex items-center">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="md:text-base">
                  {Object.entries(categories).map(([key, label]) => (
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

            <Field>
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
          </CollapsibleContent>

        </Collapsible>
      )}
    </>
  );
}
