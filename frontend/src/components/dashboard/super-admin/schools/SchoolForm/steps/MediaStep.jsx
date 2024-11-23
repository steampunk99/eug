import React, { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MediaStep({ form }) {
  const [uploading, setUploading] = useState(false);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'media.gallery',
  });

  const handleFileUpload = async (event, field) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      // TODO: Implement file upload logic here
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await uploadService.uploadFile(formData);
      // field.onChange(response.url);

      // Temporary mock upload
      const reader = new FileReader();
      reader.onloadend = () => {
        field.onChange(reader.result);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="media.logo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>School Logo</FormLabel>
            <FormControl>
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0 w-24 h-24 border-2 border-dashed rounded-lg">
                  {field.value ? (
                    <img
                      src={field.value}
                      alt="School logo"
                      className="object-cover w-full h-full rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(e, field)}
                    disabled={uploading}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Upload your school logo. Recommended size: 200x200px.
                  </p>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Gallery Images</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ url: '', caption: '', isMain: false })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Image
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="relative p-4 border rounded-lg"
            >
              <FormField
                control={form.control}
                name={`media.gallery.${index}.url`}
                render={({ field }) => (
                  <FormItem>
                    <div className="relative aspect-video mb-4 bg-muted rounded-lg overflow-hidden">
                      {field.value ? (
                        <img
                          src={field.value}
                          alt={`Gallery image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <Upload className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleFileUpload(e, field)}
                        disabled={uploading}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`media.gallery.${index}.caption`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Image caption" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`media.gallery.${index}.isMain`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 mt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          // Uncheck other main images
                          if (checked) {
                            fields.forEach((_, i) => {
                              if (i !== index) {
                                form.setValue(`media.gallery.${i}.isMain`, false);
                              }
                            });
                          }
                          field.onChange(checked);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Set as main image
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="destructive"
                size="icon"
                className={cn(
                  "absolute -top-2 -right-2",
                  "h-6 w-6",
                  "rounded-full"
                )}
                onClick={() => remove(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
