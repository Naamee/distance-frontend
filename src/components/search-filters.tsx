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

  return (
    <>
      {!isMobile && (
        <FieldSet className="my-4">
          <FieldGroup>
            <div className="md:grid md:grid-cols-3 md:gap-4 space-y-4">
              <Field>
                <Input id="name" autoComplete="off" placeholder="Item Name" className="h-10 text-sm md:text-base px-4" />
              </Field>

              <Field>
                <Select>
                  <SelectTrigger className="!h-10 md:text-base px-4 flex items-center">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="md:text-base" value="engineering">Food</SelectItem>
                    <SelectItem className="md:text-base" value="design">Cleaning Supplies</SelectItem>
                    <SelectItem className="md:text-base" value="marketing">Cosmetics</SelectItem>
                    <SelectItem className="md:text-base" value="marketing">Medicine</SelectItem>
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
              <Input id="name" autoComplete="off" placeholder="Search" />
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
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Food</SelectItem>
                  <SelectItem value="design">Cleaning Supplies</SelectItem>
                  <SelectItem value="marketing">Cosmetics</SelectItem>
                  <SelectItem value="marketing">Medicine</SelectItem>
                  <SelectItem value="marketing">
                    Kitchen / Cooking Essentials
                  </SelectItem>
                  <SelectItem value="marketing">Hardware Tools</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Available</SelectItem>
                  <SelectItem value="design">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </Field>

          </CollapsibleContent>
        </Collapsible>
      )}
    </>
  );
}
