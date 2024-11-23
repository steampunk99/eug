import React from 'react';
import { useFieldArray } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const terms = ['Term 1', 'Term 2', 'Term 3'];

export default function FeesStep({ form }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'fees.otherFees',
  });

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="fees.admissionFee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Admission Fee (UGX)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter admission fee"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="fees.tuitionFee.dayStudent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Day Student Tuition (UGX)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter day student fee"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fees.tuitionFee.boardingStudent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Boarding Student Tuition (UGX)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter boarding student fee"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Other Fees</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ name: '', amount: 0, term: 'Term 1' })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Fee
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 gap-4 p-4 border rounded-lg sm:grid-cols-3">
            <FormField
              control={form.control}
              name={`fees.otherFees.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter fee name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`fees.otherFees.${index}.amount`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (UGX)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-end gap-2">
              <FormField
                control={form.control}
                name={`fees.otherFees.${index}.term`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Term</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {terms.map((term) => (
                          <SelectItem key={term} value={term}>
                            {term}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
