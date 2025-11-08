import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMediaQuery } from "react-responsive";
import {
  Field,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import SearchFilters from "@/components/search-filters";

export const Route = createFileRoute("/fridge")({
  component: Fridge,
});

function Fridge() {
  const [currentView, setView] = useState("all");
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const menuButtons: Record<string, string> = {
    new: "Add New",
    all: "All Items",
  };

  return (
    <div className="flex gap-10 justify-center mt-10 mx-4">
      <div
        className={`bg-white border border-amber-500 p-10 transition-all duration-300 rounded-sm w-full ${currentView === "all" ? "h-full md:max-w-6xl" : "md:max-w-md"} `}
      >
        <div className="flex justify-center h-10">
          {Object.entries(menuButtons).flatMap(([key, label], index, arr) => [
            <Button
              key={key}
              size="lg"
              onClick={() => setView(key)}
              className={`bg-transparent hover:bg-transparent rounded-none font-bold text-gray-300 md:text-lg hover:text-amber-400 ${
                currentView === key ? "text-amber-600" : ""
              }`}
            >
              {label}
            </Button>,
            // Insert separator in between buttons
            index < arr.length - 1 ? (
              <Separator key={`sep-${key}`} orientation="vertical" />
            ) : null,
          ])}
        </div>

        {currentView === "new" && (
          <div className="flex flex-col justify-end">
            <FieldSet className="my-4">
              <FieldGroup className="gap-4">
                <Field>
                  <Input
                    id="name"
                    autoComplete="off"
                    placeholder="Item Name"
                    className="h-10 text-sm md:text-base px-4"
                  />
                </Field>

                <Field>
                  <Select>
                    <SelectTrigger className="!h-10 md:text-base px-4 flex items-center">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="md:text-base">
                      <SelectItem className="md:text-base" value="engineering">Food</SelectItem>
                      <SelectItem className="md:text-base" value="design">Cleaning Supplies</SelectItem>
                      <SelectItem className="md:text-base" value="marketing">Cosmetics</SelectItem>
                      <SelectItem className="md:text-base" value="marketing">Medicine</SelectItem>
                      <SelectItem className="md:text-base" value="marketing">
                        Kitchen / Cooking Essentials
                      </SelectItem>
                      <SelectItem className="md:text-base" value="marketing">Hardware Tools</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <Input
                    id="username"
                    type="number"
                    autoComplete="off"
                    placeholder="Quantity"
                    className="h-10 text-sm md:text-base px-4"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <Button className="md:h-10 mt-2 md:text-base bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:from-amber-400 active:to-amber-500 active:mt-3">
              Submit
            </Button>
          </div>
        )}

        {currentView === "all" && (
          <div>
            {<SearchFilters isMobile={isMobile} />}

            {!isMobile && (
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Name", "Category", "Quantity", "Status", ""].map(
                      (status, index) => (
                        <TableHead key={index}>{status}</TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell>$250.00</TableCell>
                    <TableCell>$250.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
