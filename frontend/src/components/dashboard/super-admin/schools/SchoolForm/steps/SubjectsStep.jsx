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

const commonSubjects = {
  oLevel: [
    'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology',
    'Geography', 'History', 'Religious Education', 'Agriculture',
    'Commerce', 'Computer Studies', 'Fine Art'
  ],
  aLevel: [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography',
    'History', 'Economics', 'Divinity', 'Computer Science',
    'Literature in English', 'Art'
  ],
  cambridge: [
    'IGCSE Mathematics', 'IGCSE English', 'IGCSE Physics',
    'IGCSE Chemistry', 'IGCSE Biology', 'IGCSE Geography',
    'IGCSE History', 'IGCSE Business Studies', 'IGCSE ICT'
  ]
};

export default function SubjectsStep({ form }) {
  const { fields: oLevelFields, append: appendOLevel, remove: removeOLevel } = useFieldArray({
    control: form.control,
    name: 'subjects.oLevel',
  });

  const { fields: aLevelFields, append: appendALevel, remove: removeALevel } = useFieldArray({
    control: form.control,
    name: 'subjects.aLevel',
  });

  const { fields: cambridgeFields, append: appendCambridge, remove: removeCambridge } = useFieldArray({
    control: form.control,
    name: 'subjects.cambridge',
  });

  const addCommonSubjects = (type) => {
    const subjects = commonSubjects[type];
    switch (type) {
      case 'oLevel':
        subjects.forEach(subject => {
          if (!oLevelFields.find(f => f.value === subject)) {
            appendOLevel(subject);
          }
        });
        break;
      case 'aLevel':
        subjects.forEach(subject => {
          if (!aLevelFields.find(f => f.value === subject)) {
            appendALevel(subject);
          }
        });
        break;
      case 'cambridge':
        subjects.forEach(subject => {
          if (!cambridgeFields.find(f => f.value === subject)) {
            appendCambridge(subject);
          }
        });
        break;
    }
  };

  const renderSubjectSection = (title, fields, append, remove, type) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>{title}</FormLabel>
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addCommonSubjects(type)}
          >
            Add Common Subjects
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append('')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        </div>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-4">
          <FormField
            control={form.control}
            name={`subjects.${type}.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Enter subject name" {...field} />
                </FormControl>
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
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {renderSubjectSection('O-Level Subjects', oLevelFields, appendOLevel, removeOLevel, 'oLevel')}
      {renderSubjectSection('A-Level Subjects', aLevelFields, appendALevel, removeALevel, 'aLevel')}
      {renderSubjectSection('Cambridge Subjects', cambridgeFields, appendCambridge, removeCambridge, 'cambridge')}
    </div>
  );
}
