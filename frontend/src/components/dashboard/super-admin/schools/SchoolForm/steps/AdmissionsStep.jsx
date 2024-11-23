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
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

export default function AdmissionsStep({ form }) {
  const { fields: requirementFields, append: appendRequirement, remove: removeRequirement } = useFieldArray({
    control: form.control,
    name: 'admissions.requirements',
  });

  const { fields: termFields, append: appendTerm, remove: removeTerm } = useFieldArray({
    control: form.control,
    name: 'admissions.termDates',
  });

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="admissions.applicationDeadline"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Application Deadline</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value ? (
                      format(field.value, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="admissions.availableSpots.dayStudents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Day Student Spots</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of spots"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="admissions.availableSpots.boardingStudents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Boarding Student Spots</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of spots"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Requirements</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendRequirement({ name: '', required: true })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Requirement
          </Button>
        </div>

        {requirementFields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <FormField
              control={form.control}
              name={`admissions.requirements.${index}.name`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Enter requirement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`admissions.requirements.${index}.required`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">Required</FormLabel>
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeRequirement(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Term Dates</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendTerm({
                term: `Term ${termFields.length + 1}`,
                startDate: new Date(),
                endDate: new Date(),
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Term
          </Button>
        </div>

        {termFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 gap-4 p-4 border rounded-lg sm:grid-cols-3">
            <FormField
              control={form.control}
              name={`admissions.termDates.${index}.term`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Term Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter term name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`admissions.termDates.${index}.startDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-end gap-2">
              <FormField
                control={form.control}
                name={`admissions.termDates.${index}.endDate`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeTerm(index)}
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
