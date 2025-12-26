'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createCampaignSchema,
  VariantInput,
} from '@/lib/validations/campaign.schema';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Switch } from '@/components/ui/switch';
import { Loader2, FolderOpen, Wand2, Plus, Trash2, Layout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type CampaignFormValues = z.infer<typeof createCampaignSchema>;

interface CampaignFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  campaign?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    folderId: string;
    isActive: boolean;
    emailSubject?: string | null;
    emailBody?: string | null;
    webhookUrl?: string | null;
    variants?: (VariantInput & { id?: string })[];
  };
}

export function CampaignForm({
  isOpen,
  onClose,
  onSuccess,
  campaign,
}: CampaignFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      name: campaign?.name || '',
      slug: campaign?.slug || '',
      description: campaign?.description || '',
      folderId: campaign?.folderId || '',
      isActive: campaign?.isActive ?? true,
      emailSubject: campaign?.emailSubject || '',
      emailBody: campaign?.emailBody || '',
      webhookUrl: campaign?.webhookUrl || '',
      variants:
        campaign?.variants?.map((v) => ({
          id: v.id,
          name: v.name || '',
          title: v.title || '',
          description: v.description || '',
          buttonText: v.buttonText || 'Request Access',
          isActive: v.isActive ?? true,
        })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  const onSubmit = async (values: CampaignFormValues) => {
    setIsSubmitting(true);
    try {
      const url = campaign ? `/api/campaigns/${campaign.id}` : '/api/campaigns';
      const method = campaign ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save campaign');
      }

      toast({
        title: campaign ? 'Campaign Updated' : 'Campaign Created',
        description: `Successfully ${campaign ? 'updated' : 'created'} "${values.name}".`,
      });

      onSuccess();
      onClose();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unknown error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);
    if (!campaign) {
      // Only auto-slug for new campaigns
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setValue('slug', slug);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {campaign ? 'Edit Campaign' : 'Create New Campaign'}
          </DialogTitle>
          <DialogDescription>
            {campaign
              ? 'Update the details for your existing campaign.'
              : 'Add a new Google Drive folder to track and sync leads.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Q4 Video Course Leads"
                      {...field}
                      onChange={handleNameChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="video-course-q4" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for the URL.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">Status</FormLabel>
                    <div className="flex h-10 items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <span className="text-sm font-medium">
                        {field.value ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="folderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-blue-600" />
                    Google Drive Folder ID
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the Drive Folder ID" {...field} />
                  </FormControl>
                  <FormDescription>
                    Right-click folder → Share → Link (ID is at the end).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What is this campaign for?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6 border-t pt-4">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-blue-600">
                <span className="rounded bg-blue-50 p-1">💎</span> Phase 4:
                Marketing Engine
              </h4>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="emailSubject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Welcome Email Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Welcome! Here is your access"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailBody"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Welcome Email Body</FormLabel>
                        <span className="flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                          <Wand2 className="h-2.5 w-2.5" /> HTML Enabled
                        </span>
                      </div>
                      <FormControl>
                        <RichTextEditor
                          content={field.value || ''}
                          onChange={field.onChange}
                          placeholder="Hi {{name}}, you now have access to {{campaign}}..."
                        />
                      </FormControl>
                      <FormDescription className="text-[10px]">
                        Use{' '}
                        <code className="rounded bg-slate-100 px-1 text-blue-700">
                          {'{{name}}'}
                        </code>{' '}
                        and{' '}
                        <code className="rounded bg-slate-100 px-1 text-blue-700">
                          {'{{campaign}}'}
                        </code>{' '}
                        for personalization.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="webhookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Webhook URL (Zapier/CRM)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://hooks.zapier.com/..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Triggers on every new lead capture.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-indigo-600">
                  <span className="rounded bg-indigo-50 p-1">
                    <Layout className="h-4 w-4" />
                  </span>{' '}
                  A/B Testing Variants
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-[10px] font-bold uppercase tracking-wider"
                  onClick={() =>
                    append({
                      name: `Variant ${fields.length + 1}`,
                      title: '',
                      description: '',
                      buttonText: 'Unlock Access',
                      isActive: true,
                    })
                  }
                >
                  <Plus className="mr-1 h-3 w-3" /> Add Variant
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="rounded-lg border border-dashed bg-slate-50 p-6 text-center">
                  <p className="text-xs font-medium italic text-slate-500">
                    No variants configured. The default campaign info will be
                    used.
                  </p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-2">
                  {fields.map((field, index) => (
                    <AccordionItem
                      key={field.id}
                      value={field.id}
                      className="rounded-lg border bg-white px-4"
                    >
                      <div className="flex items-center justify-between">
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <span className="text-xs font-bold uppercase tracking-tight text-slate-700">
                            {form.watch(`variants.${index}.name`) ||
                              `Variant ${index + 1}`}
                          </span>
                        </AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <FormField
                            control={form.control}
                            name={`variants.${index}.isActive`}
                            render={({ field }) => (
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="scale-75"
                              />
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-600"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <AccordionContent className="space-y-4 pb-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`variants.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] font-bold uppercase text-slate-400">
                                  Internal Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Variant A"
                                    {...field}
                                    value={field.value ?? ''}
                                    className="h-9 text-xs"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`variants.${index}.buttonText`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] font-bold uppercase text-slate-400">
                                  Button Text
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Get Started"
                                    {...field}
                                    value={field.value ?? ''}
                                    className="h-9 text-xs"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`variants.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-bold uppercase text-slate-400">
                                Display Title
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Catchy Headline..."
                                  {...field}
                                  value={field.value ?? ''}
                                  className="h-9 text-xs"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-bold uppercase text-slate-400">
                                Display Description
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Explain the benefit..."
                                  {...field}
                                  value={field.value ?? ''}
                                  className="resize-none text-xs"
                                  rows={2}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : campaign ? (
                  'Update Campaign'
                ) : (
                  'Create Campaign'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
