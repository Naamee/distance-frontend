import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { createFileRoute } from "@tanstack/react-router";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import SearchFilters from "@/components/search-filters";
import { useItemStore } from "@/stores/itemStore";

export const Route = createFileRoute("/fridge")({
  component: Fridge,
});

function Fridge() {
  const [currentView, setView] = useState("all");
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isSmallMobile = useMediaQuery({ maxWidth: 345 });
  const { postItem, error, loading } = useItemStore();

  const menuButtons: Record<string, string> = {
    new: "Add New",
    all: "All Items",
  };
  const categories: Record<string, string> = {
    food: "Food",
    cleaning: "Cleaning Supplies",
    cosmetics: "Cosmetics",
    medicine: "Medicine",
    kitchen: "Kitchen / Cooking Essentials",
    hardware: "Hardware Tools",
  };

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: 0,
  });

  const submitItem = async () => {
    // handle submission logic here
    const success = await postItem(newItem);
    if (success) {
      // reset form
      setNewItem({ name: "", category: "", quantity: 0 });
      setView("all");
    }
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
              <FieldGroup className="gap-3">
                <Field>
                  <Input
                    id="name"
                    autoComplete="off"
                    placeholder="Item Name"
                    className="h-10 text-sm md:text-base px-4"
                    onChange={(name) =>
                      setNewItem({ ...newItem, name: name.target.value })
                    }
                  />
                </Field>

                <Field>
                  <Select
                    value={newItem.category}
                    onValueChange={(category) =>
                      setNewItem({ ...newItem, category })
                    }
                  >
                    <SelectTrigger className="!h-10 md:text-base">
                      <span
                        className={`${isSmallMobile ? "block" : "flex"} truncate overflow-hidden text-ellipsis whitespace-nowrap w-full min-w-0`}
                      >
                        <SelectValue placeholder="Category" />
                      </span>
                    </SelectTrigger>
                    <SelectContent className="md:text-base">
                      {Object.entries(categories).map(([key, label]) => (
                        <SelectItem
                          key={key}
                          className="md:text-base"
                          value={key}
                        >
                          {label}
                        </SelectItem>
                      ))}
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
                    onChange={(quantity) =>
                      setNewItem({
                        ...newItem,
                        quantity: parseInt(quantity.target.value),
                      })
                    }
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* error alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  <p>{error}</p>
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={submitItem}
              className="md:h-10 mt-2 md:text-base bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:from-amber-400 active:to-amber-500 active:mt-3"
            >
              {loading ? <Spinner /> : null}
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
