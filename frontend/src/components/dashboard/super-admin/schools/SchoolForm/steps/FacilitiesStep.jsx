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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const commonFacilities = [
  { name: 'Science Laboratory', description: 'Fully equipped science laboratory for practical experiments' },
  { name: 'Computer Laboratory', description: 'Modern computer lab with internet access' },
  { name: 'Library', description: 'Well-stocked library with study areas' },
  { name: 'Sports Field', description: 'Multi-purpose sports field for various activities' },
  { name: 'Assembly Hall', description: 'Large hall for school gatherings and events' },
  { name: 'Dining Hall', description: 'Spacious dining area for students' },
  { name: 'Dormitories', description: 'Comfortable boarding facilities for students' },
  { name: 'Medical Center', description: 'On-site medical facility for student healthcare' },
];

export default function FacilitiesStep({ form }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'facilities',
  });

  const addCommonFacility = (facility) => {
    if (!fields.find(f => f.name === facility.name)) {
      append(facility);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <FormLabel>Facilities</FormLabel>
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: '', description: '' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Facility
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {commonFacilities.map((facility) => (
          <Button
            key={facility.name}
            type="button"
            variant="outline"
            className="h-auto p-4 text-left"
            onClick={() => addCommonFacility(facility)}
          >
            <div>
              <h4 className="font-semibold">{facility.name}</h4>
              <p className="text-sm text-muted-foreground">{facility.description}</p>
            </div>
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="grid gap-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name={`facilities.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Facility Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter facility name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="mt-6"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <FormField
              control={form.control}
              name={`facilities.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter facility description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
