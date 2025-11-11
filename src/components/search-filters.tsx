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
import { ListFilterPlus } from "lucide-react";

export default function SearchFilters({ isMobile }: { isMobile: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    status: "",
  });

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
            <div className="md:grid md:grid-cols-3 md:gap-4 space-y-4">
              <Field>
                <Input
                  id="name"
                  autoComplete="off"
                  placeholder="Item Name"
                  className="h-10 text-sm md:text-base px-4"
                  onChange={name => setFilters({...filters, name: name.target.value})}
                />
              </Field>

              <Field>
                <Select value={filters.category} onValueChange={category => setFilters({...filters, category})}>
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

              <Field>
                <Select value={filters.status} onValueChange={status => setFilters({...filters, status})}>
                  <SelectTrigger className="!h-10 md:text-base px-4 flex items-center">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      Object.entries(statuses).map(([key, label]) => (
                        <SelectItem
                          key={key}
                          className="md:text-base"
                          value={label}
                        >
                          {label}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </Field>
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
          <div className="flex items-center justify-between gap-4">
            <Field>
              <Input
                id="name"
                autoComplete="off"
                placeholder="Search"
                className="h-10 text-sm md:text-base px-4"
              />
            </Field>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <ListFilterPlus />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="flex flex-col gap-2">

            <Field>
              <Select>
                <SelectTrigger className="!h-10 md:text-base px-4 flex items-center">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="md:text-base">
                  <SelectItem className="md:text-base" value="engineering">
                    Food
                  </SelectItem>
                  <SelectItem className="md:text-base" value="design">
                    Cleaning Supplies
                  </SelectItem>
                  <SelectItem className="md:text-base" value="marketing">
                    Cosmetics
                  </SelectItem>
                  <SelectItem className="md:text-base" value="marketing">
                    Medicine
                  </SelectItem>
                  <SelectItem className="md:text-base" value="marketing">
                    Kitchen / Cooking Essentials
                  </SelectItem>
                  <SelectItem className="md:text-base" value="marketing">
                    Hardware Tools
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Select>
                <SelectTrigger className="!h-10 md:text-base px-4 flex items-center">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="md:text-base" value="engineering">Available</SelectItem>
                  <SelectItem className="md:text-base" value="design">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </CollapsibleContent>
        </Collapsible>
      )}
    </>
  );
}
