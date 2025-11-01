import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export const Route = createFileRoute('/movies')({
  component: Movies,
});

function Movies() {
  return (
    <div className="flex gap-10 justify-center mt-10">
      <div className="bg-white border border-amber-500 p-10 w-300 h-200 rounded-sm">
        <div>
          <FieldSet className="my-4">
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Input id="name" autoComplete="off" placeholder="New Movie" />
                </Field>
                <Button>Add Movie</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Input id="name" autoComplete="off" placeholder="Search" />
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
      </div>
    </div>
  );
}
