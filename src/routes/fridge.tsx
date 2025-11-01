import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const Route = createFileRoute('/fridge')({
  component: Fridge,
});

function Fridge() {
  const [currentView, setView] = useState('all');

  return (
    <div className="flex gap-10 justify-center mt-10">
      <div
        className={`bg-white border border-amber-500 p-10 ${currentView === 'all' ? 'w-300 h-full' : ''} rounded-sm`}
      >
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => setView('new')}
            className={`w-50 bg-transparent border-r hover:bg-transparent rounded-none font-bold text-gray-300 hover:text-amber-400 ${currentView === 'new' ? 'text-amber-600' : ''}`}
          >
            Add New
          </Button>
          <Button
            size="lg"
            onClick={() => setView('all')}
            className={`w-50 bg-transparent hover:bg-transparent rounded-none font-bold text-gray-300 hover:text-amber-400 ${currentView === 'all' ? 'text-amber-600' : ''}`}
          >
            All Items
          </Button>
        </div>

        {currentView === 'new' && (
          <div className="flex flex-col justify-end">
            <FieldSet className="my-4">
              <FieldGroup>
                <Field>
                  <Input id="name" autoComplete="off" placeholder="Item Name" />
                </Field>

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
                      <SelectItem value="marketing">Kitchen / Cooking Essentials</SelectItem>
                      <SelectItem value="marketing">Hardware Tools</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <Input id="username" type="number" autoComplete="off" placeholder="Quantity" />
                </Field>
              </FieldGroup>
            </FieldSet>

            <Button className="mt-2 bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:from-amber-400 active:to-amber-500 active:mt-3">
              Submit
            </Button>
          </div>
        )}

        {currentView === 'all' && (
          <div>
            <FieldSet className="my-4">
              <FieldGroup>
                <div className="grid grid-cols-3 gap-4">
                  <Field>
                    <Input id="name" autoComplete="off" placeholder="Item Name" />
                  </Field>

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
                        <SelectItem value="marketing">Kitchen / Cooking Essentials</SelectItem>
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
                </div>
              </FieldGroup>
            </FieldSet>

            <Table>
              <TableHeader>
                <TableRow>
                  {['Name', 'Category', 'Quantity', 'Status', ''].map((status, index) => (
                    <TableHead key={index}>{status}</TableHead>
                  ))}
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
          </div>
        )}
      </div>
    </div>
  );
}
